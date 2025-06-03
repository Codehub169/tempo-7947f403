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
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiLinkedin,
  FiSave,
  FiXCircle,
  FiUsers
} from 'react-icons/fi';

// Define the structure of contact data
export interface ContactFormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  accountId?: string; // ID of the linked account
  accountName?: string; // Display name of the linked account, for UI purposes
  jobTitle?: string;
  department?: string;
  linkedinProfile?: string;
  mailingStreet?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingPostalCode?: string;
  mailingCountry?: string;
  description?: string;
  contactOwnerId?: string; // ID of the user who owns this contact
}

interface ContactFormProps {
  initialData?: ContactFormData;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  formTitle?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  formTitle = 'Contact Information',
}) => {
  // Form state for contact data
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobilePhone: '',
    accountId: '',
    accountName: '',
    jobTitle: '',
    department: '',
    linkedinProfile: '',
    mailingStreet: '',
    mailingCity: '',
    mailingState: '',
    mailingPostalCode: '',
    mailingCountry: '',
    description: '',
    contactOwnerId: '',
    ...initialData,
  });

  // State for form validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  // Update form data when initialData changes (e.g., for editing)
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Handle input changes and update form state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form fields
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    // Optional: Add more specific validations (e.g., phone format, LinkedIn URL)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  // Styling values based on color mode
  const cardBg = useColorModeValue('white', 'gray.700');
  const inputBg = useColorModeValue('gray.50', 'gray.800');
  const focusBorderColor = useColorModeValue('crm-primary.500', 'crm-primary.300');

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
          {/* Contact Name Fields */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.firstName} isRequired>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiUser} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.firstName}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.lastName} isRequired>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiUser} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.lastName}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {/* Email and Phone Fields */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.email} isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiMail} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.email}</FormErrorMessage>
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

          {/* Mobile Phone and Account */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.mobilePhone}>
              <FormLabel htmlFor="mobilePhone">Mobile Phone</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiPhone} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="mobilePhone"
                  name="mobilePhone"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobilePhone || ''}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.mobilePhone}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.accountId}>
              <FormLabel htmlFor="accountId">Account</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiBriefcase} color="gray.400" />
                </InputLeftElement>
                {/* This would ideally be a searchable select component */}
                <Input
                  id="accountName" // Using accountName for display, actual submission uses accountId
                  name="accountName"
                  placeholder="Search or select account"
                  value={formData.accountName || ''} // Display account name if available
                  onChange={handleChange} // You'd need a more complex handler for searchable select
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.accountId}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {/* Job Title and Department */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.jobTitle}>
              <FormLabel htmlFor="jobTitle">Job Title</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiBriefcase} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="Enter job title"
                  value={formData.jobTitle || ''}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.jobTitle}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.department}>
              <FormLabel htmlFor="department">Department</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiUsers} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="department"
                  name="department"
                  placeholder="Enter department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.department}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {/* LinkedIn Profile */}
          <FormControl isInvalid={!!errors.linkedinProfile}>
            <FormLabel htmlFor="linkedinProfile">LinkedIn Profile URL</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiLinkedin} color="gray.400" />
              </InputLeftElement>
              <Input
                id="linkedinProfile"
                name="linkedinProfile"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedinProfile || ''}
                onChange={handleChange}
                bg={inputBg}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
              />
            </InputGroup>
            <FormErrorMessage>{errors.linkedinProfile}</FormErrorMessage>
          </FormControl>

          {/* Mailing Address Fields */}
          <Heading as="h3" size="md" mt={4} mb={2} fontFamily="Poppins" color="gray.600">
            Mailing Address
          </Heading>
          <FormControl isInvalid={!!errors.mailingStreet}>
            <FormLabel htmlFor="mailingStreet">Street</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiMapPin} color="gray.400" />
              </InputLeftElement>
              <Input
                id="mailingStreet"
                name="mailingStreet"
                placeholder="Enter street address"
                value={formData.mailingStreet || ''}
                onChange={handleChange}
                bg={inputBg}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
              />
            </InputGroup>
            <FormErrorMessage>{errors.mailingStreet}</FormErrorMessage>
          </FormControl>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.mailingCity}>
              <FormLabel htmlFor="mailingCity">City</FormLabel>
              <Input
                id="mailingCity"
                name="mailingCity"
                placeholder="Enter city"
                value={formData.mailingCity || ''}
                onChange={handleChange}
                bg={inputBg}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
              />
              <FormErrorMessage>{errors.mailingCity}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.mailingState}>
              <FormLabel htmlFor="mailingState">State / Province</FormLabel>
              <Input
                id="mailingState"
                name="mailingState"
                placeholder="Enter state or province"
                value={formData.mailingState || ''}
                onChange={handleChange}
                bg={inputBg}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
              />
              <FormErrorMessage>{errors.mailingState}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.mailingPostalCode}>
              <FormLabel htmlFor="mailingPostalCode">Postal Code</FormLabel>
              <Input
                id="mailingPostalCode"
                name="mailingPostalCode"
                placeholder="Enter postal code"
                value={formData.mailingPostalCode || ''}
                onChange={handleChange}
                bg={inputBg}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
              />
              <FormErrorMessage>{errors.mailingPostalCode}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.mailingCountry}>
              <FormLabel htmlFor="mailingCountry">Country</FormLabel>
              <Input
                id="mailingCountry"
                name="mailingCountry"
                placeholder="Enter country"
                value={formData.mailingCountry || ''}
                onChange={handleChange}
                bg={inputBg}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
              />
              <FormErrorMessage>{errors.mailingCountry}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {/* Description Field */}
          <FormControl isInvalid={!!errors.description}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter any additional details about the contact"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              bg={inputBg}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              _focus={{ borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` }}
            />
            <FormErrorMessage>{errors.description}</FormErrorMessage>
          </FormControl>

          {/* Action Buttons */}
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
            <Tooltip label="Save contact information" placement="top">
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
              {initialData ? 'Save Changes' : 'Create Contact'}
            </Button>
            </Tooltip>
          </SimpleGrid>
        </VStack>
      </form>
    </Box>
  );
};

export default ContactForm;
