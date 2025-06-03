import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  Select,
  Button,
  VStack,
  Heading,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Checkbox,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiBriefcase,
  FiDollarSign,
  FiUsers,
  FiGlobe,
  FiPhone,
  FiMapPin,
  FiSave,
  FiXCircle,
  FiTrendingUp,
  FiTag
} from 'react-icons/fi';

// Define the structure of account data
export interface AccountFormData {
  id?: string;
  accountName: string;
  industry?: string;
  type?: 'Prospect' | 'Customer' | 'Partner' | 'Vendor' | 'Other'; // Example types
  website?: string;
  phone?: string;
  annualRevenue?: number | string; // Allow string for input flexibility
  numberOfEmployees?: number | string;
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  shippingStreet?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  description?: string;
  accountOwnerId?: string; // ID of the user who owns this account
}

interface AccountFormProps {
  initialData?: AccountFormData;
  onSubmit: (data: AccountFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  formTitle?: string;
}

const AccountForm: React.FC<AccountFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  formTitle = 'Account Information',
}) => {
  // Form state for account data
  const [formData, setFormData] = useState<AccountFormData>({
    accountName: '',
    industry: '',
    type: undefined,
    website: '',
    phone: '',
    annualRevenue: '',
    numberOfEmployees: '',
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',
    billingCountry: '',
    shippingStreet: '',
    shippingCity: '',
    shippingState: '',
    shippingPostalCode: '',
    shippingCountry: '',
    description: '',
    accountOwnerId: '',
    ...initialData,
  });

  // State for form validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof AccountFormData, string>>>({});
  // State for 'Same as Billing Address' checkbox
  const [isSameAsBilling, setIsSameAsBilling] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
      // Check if shipping and billing are the same initially
      if (
        initialData.billingStreet === initialData.shippingStreet &&
        initialData.billingCity === initialData.shippingCity &&
        initialData.billingState === initialData.shippingState &&
        initialData.billingPostalCode === initialData.shippingPostalCode &&
        initialData.billingCountry === initialData.shippingCountry &&
        (initialData.billingStreet || initialData.billingCity) // Only if billing address is set
      ) {
        setIsSameAsBilling(true);
      }
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errors[name as keyof AccountFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle 'Same as Billing Address' checkbox
  useEffect(() => {
    if (isSameAsBilling) {
      setFormData((prev) => ({
        ...prev,
        shippingStreet: prev.billingStreet,
        shippingCity: prev.billingCity,
        shippingState: prev.billingState,
        shippingPostalCode: prev.billingPostalCode,
        shippingCountry: prev.billingCountry,
      }));
    } else if (initialData && 
        !(initialData.billingStreet === initialData.shippingStreet &&
        initialData.billingCity === initialData.shippingCity &&
        initialData.billingState === initialData.shippingState &&
        initialData.billingPostalCode === initialData.shippingPostalCode &&
        initialData.billingCountry === initialData.shippingCountry) 
    ) {
      // If unchecked and not initially same, revert to initial shipping or clear
      setFormData((prev) => ({
        ...prev,
        shippingStreet: initialData?.shippingStreet || '',
        shippingCity: initialData?.shippingCity || '',
        shippingState: initialData?.shippingState || '',
        shippingPostalCode: initialData?.shippingPostalCode || '',
        shippingCountry: initialData?.shippingCountry || '',
      }));
    }

  }, [isSameAsBilling, formData.billingStreet, formData.billingCity, formData.billingState, formData.billingPostalCode, formData.billingCountry, initialData]);

  // Validate form fields
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AccountFormData, string>> = {};
    if (!formData.accountName.trim()) newErrors.accountName = 'Account name is required.';
    if (formData.website && !/^(ftp|http|https):\/\/[^ "]+$/.test(formData.website)) {
      newErrors.website = 'Website URL is invalid.';
    }
    if (formData.annualRevenue && isNaN(Number(formData.annualRevenue))) {
        newErrors.annualRevenue = 'Annual revenue must be a number.';
    }
    if (formData.numberOfEmployees && isNaN(Number(formData.numberOfEmployees))) {
        newErrors.numberOfEmployees = 'Number of employees must be a number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const dataToSubmit = {
        ...formData,
        annualRevenue: formData.annualRevenue ? Number(formData.annualRevenue) : undefined,
        numberOfEmployees: formData.numberOfEmployees ? Number(formData.numberOfEmployees) : undefined,
      };
      await onSubmit(dataToSubmit);
    }
  };

  const cardBg = useColorModeValue('white', 'gray.700');
  const inputBg = useColorModeValue('gray.50', 'gray.800');
  const focusBorderColor = useColorModeValue('crm-primary.500', 'crm-primary.300');

  const accountTypes = ['Prospect', 'Customer', 'Partner', 'Vendor', 'Other'];
  const industries = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Consulting', 'Other']; // Example industries

  return (
    <Box
      bg={cardBg}
      p={{ base: 6, md: 8 }}
      borderRadius="xl"
      shadow="xl"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
    >
      <Heading as="h2" size="lg" mb={6} color="crm-primary.600" fontFamily="Poppins">
        {formTitle}
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={!!errors.accountName} isRequired>
            <FormLabel htmlFor="accountName">Account Name</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiBriefcase} color="gray.400" />
              </InputLeftElement>
              <Input
                id="accountName"
                name="accountName"
                placeholder="Enter account name"
                value={formData.accountName}
                onChange={handleChange}
                bg={inputBg}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
              />
            </InputGroup>
            <FormErrorMessage>{errors.accountName}</FormErrorMessage>
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.industry}>
              <FormLabel htmlFor="industry">Industry</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <Icon as={FiTrendingUp} color="gray.400" />
                </InputLeftElement>
                <Select 
                    id="industry" 
                    name="industry" 
                    placeholder="Select industry"
                    value={formData.industry || ''} 
                    onChange={handleChange}
                    bg={inputBg}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                    _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                    pl={10}
                >
                    {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </Select>
              </InputGroup>
              <FormErrorMessage>{errors.industry}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.type}>
              <FormLabel htmlFor="type">Account Type</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <Icon as={FiTag} color="gray.400" />
                </InputLeftElement>
                <Select 
                    id="type" 
                    name="type" 
                    placeholder="Select account type"
                    value={formData.type || ''} 
                    onChange={handleChange}
                    bg={inputBg}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                    _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                    pl={10}
                >
                    {accountTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </Select>
              </InputGroup>
              <FormErrorMessage>{errors.type}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.website}>
              <FormLabel htmlFor="website">Website</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiGlobe} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website || ''}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.website}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.phone}>
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiPhone} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.annualRevenue}>
              <FormLabel htmlFor="annualRevenue">Annual Revenue (INR)</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiDollarSign} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="annualRevenue"
                  name="annualRevenue"
                  type="number"
                  placeholder="e.g., 5000000"
                  value={formData.annualRevenue || ''}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.annualRevenue}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.numberOfEmployees}>
              <FormLabel htmlFor="numberOfEmployees">Number of Employees</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiUsers} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="numberOfEmployees"
                  name="numberOfEmployees"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.numberOfEmployees || ''}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.numberOfEmployees}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {/* Billing Address */}
          <Heading as="h3" size="md" mt={4} mb={2} fontFamily="Poppins" color="gray.600">
            Billing Address
          </Heading>
          <FormControl isInvalid={!!errors.billingStreet}>
            <FormLabel htmlFor="billingStreet">Street</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiMapPin} color="gray.400" />
              </InputLeftElement>
              <Input id="billingStreet" name="billingStreet" value={formData.billingStreet || ''} onChange={handleChange} placeholder="Billing street" bg={inputBg} _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}/>
            </InputGroup>
            <FormErrorMessage>{errors.billingStreet}</FormErrorMessage>
          </FormControl>
          <SimpleGrid columns={{base: 1, md: 2}} spacing={6}>
            <FormControl isInvalid={!!errors.billingCity}>
              <FormLabel htmlFor="billingCity">City</FormLabel>
              <Input id="billingCity" name="billingCity" value={formData.billingCity || ''} onChange={handleChange} placeholder="Billing city" bg={inputBg} _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}/>
              <FormErrorMessage>{errors.billingCity}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.billingState}>
              <FormLabel htmlFor="billingState">State / Province</FormLabel>
              <Input id="billingState" name="billingState" value={formData.billingState || ''} onChange={handleChange} placeholder="Billing state" bg={inputBg} _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}/>
              <FormErrorMessage>{errors.billingState}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={{base: 1, md: 2}} spacing={6}>
            <FormControl isInvalid={!!errors.billingPostalCode}>
              <FormLabel htmlFor="billingPostalCode">Postal Code</FormLabel>
              <Input id="billingPostalCode" name="billingPostalCode" value={formData.billingPostalCode || ''} onChange={handleChange} placeholder="Billing postal code" bg={inputBg} _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}/>
              <FormErrorMessage>{errors.billingPostalCode}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.billingCountry}>
              <FormLabel htmlFor="billingCountry">Country</FormLabel>
              <Input id="billingCountry" name="billingCountry" value={formData.billingCountry || ''} onChange={handleChange} placeholder="Billing country" bg={inputBg} _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}/>
              <FormErrorMessage>{errors.billingCountry}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {/* Shipping Address */}
          <Heading as="h3" size="md" mt={4} mb={2} fontFamily="Poppins" color="gray.600">
            Shipping Address
          </Heading>
          <Checkbox 
            isChecked={isSameAsBilling} 
            onChange={(e) => setIsSameAsBilling(e.target.checked)}
            colorScheme="crm-primary"
            mb={4}
          >
            Same as Billing Address
          </Checkbox>
          {!isSameAsBilling && (
            <>
              <FormControl isInvalid={!!errors.shippingStreet}>
                <FormLabel htmlFor="shippingStreet">Street</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiMapPin} color="gray.400" />
                  </InputLeftElement>
                  <Input id="shippingStreet" name="shippingStreet" value={formData.shippingStreet || ''} onChange={handleChange} placeholder="Shipping street" bg={inputBg} _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}/>
                </InputGroup>
                <FormErrorMessage>{errors.shippingStreet}</FormErrorMessage>
              </FormControl>
              <SimpleGrid columns={{base: 1, md: 2}} spacing={6}>
                <FormControl isInvalid={!!errors.shippingCity}>
                  <FormLabel htmlFor="shippingCity">City</FormLabel>
                  <Input id="shippingCity" name="shippingCity" value={formData.shippingCity || ''} onChange={handleChange} placeholder="Shipping city" bg={inputBg} _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}/>
                  <FormErrorMessage>{errors.shippingCity}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.shippingState}>
                  <FormLabel htmlFor="shippingState">State / Province</FormLabel>
                  <Input id="shippingState" name="shippingState" value={formData.shippingState || ''} onChange={handleChange} placeholder="Shipping state" bg={inputBg} _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}/>
                  <FormErrorMessage>{errors.shippingState}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={{base: 1, md: 2}} spacing={6}>
                <FormControl isInvalid={!!errors.shippingPostalCode}>
                  <FormLabel htmlFor="shippingPostalCode">Postal Code</FormLabel>
                  <Input id="shippingPostalCode" name="shippingPostalCode" value={formData.shippingPostalCode || ''} onChange={handleChange} placeholder="Shipping postal code" bg={inputBg} _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}/>
                  <FormErrorMessage>{errors.shippingPostalCode}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.shippingCountry}>
                  <FormLabel htmlFor="shippingCountry">Country</FormLabel>
                  <Input id="shippingCountry" name="shippingCountry" value={formData.shippingCountry || ''} onChange={handleChange} placeholder="Shipping country" bg={inputBg} _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}/>
                  <FormErrorMessage>{errors.shippingCountry}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>
            </>
          )}

          <FormControl isInvalid={!!errors.description}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter any additional details about the account"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              bg={inputBg}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
            />
            <FormErrorMessage>{errors.description}</FormErrorMessage>
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
            {onCancel && (
              <Tooltip label="Discard changes" placement="top">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  leftIcon={<Icon as={FiXCircle} />}
                  isDisabled={isLoading}
                  borderColor={useColorModeValue('gray.300', 'gray.500')}
                  _hover={{
                    bg: useColorModeValue('gray.100', 'gray.600'),
                    borderColor: useColorModeValue('gray.400', 'gray.400'),
                  }}
                >
                  Cancel
                </Button>
              </Tooltip>
            )}
            <Tooltip label="Save account information" placement="top">
            <Button
              type="submit"
              colorScheme="crm-primary"
              isLoading={isLoading}
              loadingText="Saving..."
              leftIcon={<Icon as={FiSave} />}
              _hover={{
                bg: 'crm-primary.600',
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              _active={{
                bg: 'crm-primary.700',
                transform: 'translateY(0)',
              }}
            >
              {initialData ? 'Save Changes' : 'Create Account'}
            </Button>
            </Tooltip>
          </SimpleGrid>
        </VStack>
      </form>
    </Box>
  );
};

export default AccountForm;
