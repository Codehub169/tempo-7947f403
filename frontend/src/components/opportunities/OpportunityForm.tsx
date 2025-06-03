import React, { useState, useEffect } from 'react';
import { 
  Box, FormControl, FormLabel, Input, Select, Textarea, Button, SimpleGrid, 
  InputGroup, InputLeftElement, Icon, FormErrorMessage, Heading, VStack, 
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, 
  useColorModeValue, Tooltip, Text, HStack
} from '@chakra-ui/react';
import { FiBriefcase, FiDollarSign, FiCalendar, FiPercent, FiFileText, FiUser, FiSave, FiXCircle, FiTrendingUp, FiTag } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

// Mock data - replace with actual data fetching
const mockAccounts = [
  { id: 'acc1', name: 'Tech Solutions Ltd.' },
  { id: 'acc2', name: 'Innovatech Inc.' },
];
const mockUsers = [
  { id: 'user1', name: 'Sales Rep A' },
  { id: 'user2', name: 'Sales Rep B' },
];

export interface OpportunityFormData {
  id?: string;
  opportunityName: string;
  accountId: string;
  stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  amount: number;
  closeDate: string; // YYYY-MM-DD
  probability?: number;
  description?: string;
  leadSource?: string;
  ownerId: string;
  // contactId?: string; // Optional: If opportunities are linked to specific contacts
}

interface OpportunityFormProps {
  initialData?: OpportunityFormData;
  onSubmit: (data: OpportunityFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  formTitle?: string;
}

const opportunityStages: OpportunityFormData['stage'][] = [
  'Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'
];

const leadSources = ['Web', 'Referral', 'Cold Call', 'Partner', 'Advertisement', 'Other'];

export const OpportunityForm: React.FC<OpportunityFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  formTitle = 'Opportunity Information'
}) => {
  const [formData, setFormData] = useState<OpportunityFormData>({
    opportunityName: '',
    accountId: '',
    stage: 'Prospecting',
    amount: 0,
    closeDate: format(new Date(), 'yyyy-MM-dd'),
    probability: 0,
    description: '',
    leadSource: '',
    ownerId: '',
    ...(initialData || {}),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OpportunityFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        closeDate: initialData.closeDate ? format(parseISO(initialData.closeDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof OpportunityFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAmountChange = (valueAsString: string, valueAsNumber: number) => {
    setFormData(prev => ({ ...prev, amount: isNaN(valueAsNumber) ? 0 : valueAsNumber }));
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  const handleProbabilityChange = (valueAsString: string, valueAsNumber: number) => {
    setFormData(prev => ({ ...prev, probability: isNaN(valueAsNumber) ? 0 : valueAsNumber }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OpportunityFormData, string>> = {};
    if (!formData.opportunityName.trim()) newErrors.opportunityName = 'Opportunity name is required.';
    if (!formData.accountId) newErrors.accountId = 'Account is required.';
    if (!formData.stage) newErrors.stage = 'Stage is required.';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than zero.';
    if (!formData.closeDate) newErrors.closeDate = 'Close date is required.';
    if (!formData.ownerId) newErrors.ownerId = 'Owner is required.';
    if (formData.probability && (formData.probability < 0 || formData.probability > 100)) {
        newErrors.probability = 'Probability must be between 0 and 100.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const focusBorderColor = useColorModeValue('crm-primary.500', 'crm-primary.300');

  return (
    <Box bg={cardBg} p={{ base: 6, md: 8 }} borderRadius="xl" shadow="xl" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
      <Heading as="h2" size="lg" mb={6} color="crm-primary.600" fontWeight="medium" fontFamily="Poppins">
        {formTitle}
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.opportunityName} isRequired>
              <FormLabel htmlFor="opportunityName" fontWeight="medium">Opportunity Name</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiBriefcase} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="opportunityName"
                  name="opportunityName"
                  value={formData.opportunityName}
                  onChange={handleChange}
                  placeholder="e.g., New Website Project"
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                  focusBorderColor={focusBorderColor}
                  borderRadius="md"
                />
              </InputGroup>
              {errors.opportunityName && <FormErrorMessage>{errors.opportunityName}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.accountId} isRequired>
              <FormLabel htmlFor="accountId" fontWeight="medium">Account</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiBriefcase} color="gray.400" />
                </InputLeftElement>
                <Select 
                  id="accountId" 
                  name="accountId" 
                  value={formData.accountId}
                  onChange={handleChange}
                  placeholder="Select account"
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                  focusBorderColor={focusBorderColor}
                  borderRadius="md"
                >
                  {mockAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </Select>
              </InputGroup>
              {errors.accountId && <FormErrorMessage>{errors.accountId}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.stage} isRequired>
              <FormLabel htmlFor="stage" fontWeight="medium">Stage</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiTrendingUp} color="gray.400" />
                </InputLeftElement>
                <Select 
                  id="stage" 
                  name="stage" 
                  value={formData.stage}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                  focusBorderColor={focusBorderColor}
                  borderRadius="md"
                >
                  {opportunityStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                </Select>
              </InputGroup>
              {errors.stage && <FormErrorMessage>{errors.stage}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.amount} isRequired>
              <FormLabel htmlFor="amount" fontWeight="medium">Amount (INR)</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiDollarSign} color="gray.400" />
                </InputLeftElement>
                <NumberInput 
                  id="amount" 
                  name="amount" 
                  value={formData.amount}
                  onChange={handleAmountChange}
                  min={0}
                  precision={2}
                  w="full"
                  bg={inputBg}
                  borderRadius="md"
                >
                  <NumberInputField 
                    pl="2.5rem" 
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                    focusBorderColor={focusBorderColor}
                    borderRadius="md"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
              {errors.amount && <FormErrorMessage>{errors.amount}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.closeDate} isRequired>
              <FormLabel htmlFor="closeDate" fontWeight="medium">Close Date</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiCalendar} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="closeDate"
                  name="closeDate"
                  type="date"
                  value={formData.closeDate}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                  focusBorderColor={focusBorderColor}
                  borderRadius="md"
                />
              </InputGroup>
              {errors.closeDate && <FormErrorMessage>{errors.closeDate}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.probability}>
              <FormLabel htmlFor="probability" fontWeight="medium">Probability (%)</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiPercent} color="gray.400" />
                </InputLeftElement>
                <NumberInput 
                  id="probability" 
                  name="probability" 
                  value={formData.probability}
                  onChange={handleProbabilityChange}
                  min={0}
                  max={100}
                  w="full"
                  bg={inputBg}
                  borderRadius="md"
                >
                  <NumberInputField 
                    pl="2.5rem" 
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                    focusBorderColor={focusBorderColor}
                    borderRadius="md"
                   />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
              {errors.probability && <FormErrorMessage>{errors.probability}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.ownerId} isRequired>
              <FormLabel htmlFor="ownerId" fontWeight="medium">Opportunity Owner</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiUser} color="gray.400" />
                </InputLeftElement>
                <Select 
                  id="ownerId" 
                  name="ownerId" 
                  value={formData.ownerId}
                  onChange={handleChange}
                  placeholder="Select owner"
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                  focusBorderColor={focusBorderColor}
                  borderRadius="md"
                >
                  {mockUsers.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                </Select>
              </InputGroup>
              {errors.ownerId && <FormErrorMessage>{errors.ownerId}</FormErrorMessage>}
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="leadSource" fontWeight="medium">Lead Source</FormLabel>
              <InputGroup>
                 <InputLeftElement pointerEvents="none">
                  <Icon as={FiTag} color="gray.400" />
                </InputLeftElement>
                <Select 
                  id="leadSource" 
                  name="leadSource" 
                  value={formData.leadSource}
                  onChange={handleChange}
                  placeholder="Select lead source"
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                  focusBorderColor={focusBorderColor}
                  borderRadius="md"
                >
                  {leadSources.map(source => <option key={source} value={source}>{source}</option>)}
                </Select>
              </InputGroup>
            </FormControl>
          </SimpleGrid>

          <FormControl isInvalid={!!errors.description}>
            <FormLabel htmlFor="description" fontWeight="medium">Description</FormLabel>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter opportunity details, notes, or next steps..."
              rows={5}
              bg={inputBg}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
              focusBorderColor={focusBorderColor}
              borderRadius="md"
              resize="vertical"
            />
            {errors.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
          </FormControl>

          <HStack justifyContent="flex-end" spacing={4} mt={4}>
            {onCancel && (
              <Button 
                variant="outline"
                onClick={onCancel} 
                leftIcon={<Icon as={FiXCircle} />} 
                isDisabled={isLoading}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700')}}
                borderRadius="md"
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              isLoading={isLoading} 
              colorScheme="crm-primary"
              leftIcon={<Icon as={FiSave} />} 
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              _active={{ transform: 'translateY(0)' }}
              borderRadius="md"
            >
              {initialData ? 'Save Changes' : 'Create Opportunity'}
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};
