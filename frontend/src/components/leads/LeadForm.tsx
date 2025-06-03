import React, { useState, useEffect } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, Heading, 
  useColorModeValue, FormErrorMessage, Grid, InputGroup, InputLeftElement, Icon, SimpleGrid, chakra
} from '@chakra-ui/react';
import { FiUser, FiBriefcase, FiMail, FiPhone, FiDollarSign, FiInfo, FiList, FiSave, FiXCircle } from 'react-icons/fi';

export interface LeadFormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Lost' | 'Won'; // Expanded status
  source?: 'Website' | 'Referral' | 'Cold Call' | 'Advertisement' | 'Event' | 'Other';
  leadOwnerId?: string; // Assuming this will be an ID
  estimatedValue?: number;
  description?: string;
}

interface LeadFormProps {
  initialData?: LeadFormData;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  formTitle?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, onCancel, isLoading, formTitle = 'Lead Information' }) => {
  const [formData, setFormData] = useState<LeadFormData>(
    initialData || {
      firstName: '',
      lastName: '',
      email: '',
      status: 'New',
    }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LeadFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.status) newErrors.status = 'Status is required.';
    if (formData.estimatedValue && formData.estimatedValue < 0) newErrors.estimatedValue = 'Estimated value cannot be negative.';

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

  const inputStyles = {
    bg: inputBg,
    borderColor: useColorModeValue('gray.300', 'gray.600'),
    _hover: { borderColor: useColorModeValue('gray.400', 'gray.500') },
    _focus: { borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}` },
  };

  return (
    <Box bg={cardBg} p={{ base: 4, md: 8 }} borderRadius="xl" shadow="xl" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
      <Heading as="h2" size="lg" mb={6} fontFamily="Poppins" color={useColorModeValue('gray.700', 'whiteAlpha.900')}>{formTitle}</Heading>
      <chakra.form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.firstName} isRequired>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none"><Icon as={FiUser} color="gray.400" /></InputLeftElement>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g., Priya" {...inputStyles} />
              </InputGroup>
              <FormErrorMessage>{errors.firstName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName} isRequired>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none"><Icon as={FiUser} color="gray.400" /></InputLeftElement>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g., Sharma" {...inputStyles} />
              </InputGroup>
              <FormErrorMessage>{errors.lastName}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <FormControl isInvalid={!!errors.email} isRequired>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none"><Icon as={FiMail} color="gray.400" /></InputLeftElement>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="e.g., priya.sharma@example.com" {...inputStyles} />
            </InputGroup>
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.phone}>
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none"><Icon as={FiPhone} color="gray.400" /></InputLeftElement>
                <Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} placeholder="e.g., +91 98765 43210" {...inputStyles} />
              </InputGroup>
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.company}>
              <FormLabel htmlFor="company">Company</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none"><Icon as={FiBriefcase} color="gray.400" /></InputLeftElement>
                <Input id="company" name="company" value={formData.company || ''} onChange={handleChange} placeholder="e.g., Tech Solutions Pvt. Ltd." {...inputStyles} />
              </InputGroup>
              <FormErrorMessage>{errors.company}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.status} isRequired>
              <FormLabel htmlFor="status">Lead Status</FormLabel>
              <Select id="status" name="status" value={formData.status} onChange={handleChange} {...inputStyles} icon={<Icon as={FiList} />}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Lost">Lost</option>
                <option value="Won">Won</option>
              </Select>
              <FormErrorMessage>{errors.status}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.source}>
              <FormLabel htmlFor="source">Lead Source</FormLabel>
              <Select id="source" name="source" value={formData.source || ''} onChange={handleChange} placeholder="Select source" {...inputStyles} icon={<Icon as={FiInfo} />}>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Event">Event</option>
                <option value="Other">Other</option>
              </Select>
              <FormErrorMessage>{errors.source}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <FormControl isInvalid={!!errors.estimatedValue}>
            <FormLabel htmlFor="estimatedValue">Estimated Value (INR)</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none"><Icon as={FiDollarSign} color="gray.400" /></InputLeftElement>
              <Input id="estimatedValue" name="estimatedValue" type="number" value={formData.estimatedValue || ''} onChange={handleChange} placeholder="e.g., 50000" {...inputStyles} />
            </InputGroup>
            <FormErrorMessage>{errors.estimatedValue}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.description}>
            <FormLabel htmlFor="description">Description / Notes</FormLabel>
            <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} placeholder="Enter any additional details about the lead..." rows={4} {...inputStyles} />
            <FormErrorMessage>{errors.description}</FormErrorMessage>
          </FormControl>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mt={4}>
            {onCancel && (
              <Button 
                variant="outline" 
                colorScheme="gray" 
                onClick={onCancel} 
                leftIcon={<FiXCircle />} 
                isDisabled={isLoading}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700')}}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              colorScheme="crm-primary" 
              isLoading={isLoading} 
              loadingText="Saving..." 
              leftIcon={<FiSave />} 
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              style={{gridColumn: onCancel ? '2 / 3' : '1 / -1'}}
            >
              {initialData ? 'Save Changes' : 'Create Lead'}
            </Button>
          </Grid>
        </VStack>
      </chakra.form>
    </Box>
  );
};

export default LeadForm;
