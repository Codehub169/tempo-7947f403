import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, FormErrorMessage, Input, Select, Textarea, VStack, HStack, Icon, useColorModeValue, Heading, chakra
} from '@chakra-ui/react';
import { FiActivity, FiBriefcase, FiCalendar, FiMessageSquare, FiPhone, FiSave, FiType, FiUser, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns'; // For default date

export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'Note' | 'TaskCreated';
export type RelatedEntityType = 'Lead' | 'Contact' | 'Account' | 'Opportunity';

export interface ActivityFormData {
  type: ActivityType;
  summary: string;
  date: string; // ISO string or YYYY-MM-DDTHH:mm
  notes?: string;
  relatedToId: string;
  relatedToType: RelatedEntityType;
  // Potentially add duration for calls/meetings, participants etc.
}

interface ActivityLogFormProps {
  entityId: string;
  entityType: RelatedEntityType;
  onSubmit: (data: ActivityFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  formTitle?: string;
}

const ActivityLogForm: React.FC<ActivityLogFormProps> = ({
  entityId,
  entityType,
  onSubmit,
  onCancel,
  isLoading = false,
  formTitle = 'Log New Activity',
}) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    type: 'Call',
    summary: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"), // Default to current date and time
    notes: '',
    relatedToId: entityId,
    relatedToType: entityType,
  });
  const [errors, setErrors] = useState<Partial<ActivityFormData>>({});

  const bgColor = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const activityTypes: { value: ActivityType; label: string; icon: React.ElementType }[] = [
    { value: 'Call', label: 'Call', icon: FiPhone },
    { value: 'Email', label: 'Email', icon: FiMessageSquare }, // Using FiMessageSquare for email as FiMail is common for user email fields
    { value: 'Meeting', label: 'Meeting', icon: FiBriefcase },
    { value: 'Note', label: 'Note', icon: FiType },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ActivityFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<ActivityFormData> = {};
    if (!formData.type) newErrors.type = 'Activity type is required.';
    if (!formData.summary.trim()) newErrors.summary = 'Summary is required.';
    if (!formData.date) newErrors.date = 'Date is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <Box bg={bgColor} p={6} borderRadius="xl" shadow="xl" borderWidth="1px" borderColor={borderColor}>
      <Heading as="h3" size="lg" mb={6} fontFamily="Poppins" display="flex" alignItems="center">
        <Icon as={FiActivity} mr={2} color="crm-primary.500" /> {formTitle}
      </Heading>
      <chakra.form onSubmit={handleSubmit}>
        <VStack spacing={5} align="stretch">
          <FormControl isInvalid={!!errors.type} isRequired>
            <FormLabel htmlFor="type" fontWeight="semibold" fontFamily="Inter">Activity Type</FormLabel>
            <Select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Select activity type"
              focusBorderColor="crm-primary.500"
              bg={inputBg}
              _hover={{ borderColor: 'gray.400' }}
              borderRadius="md"
            >
              {activityTypes.map((typeOpt) => (
                <option key={typeOpt.value} value={typeOpt.value}>
                  {typeOpt.label}
                </option>
              ))}
            </Select>
            {errors.type && <FormErrorMessage>{errors.type}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!errors.summary} isRequired>
            <FormLabel htmlFor="summary" fontWeight="semibold" fontFamily="Inter">Summary</FormLabel>
            <Input
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Brief summary of the activity"
              focusBorderColor="crm-primary.500"
              bg={inputBg}
              _hover={{ borderColor: 'gray.400' }}
              borderRadius="md"
            />
            {errors.summary && <FormErrorMessage>{errors.summary}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!errors.date} isRequired>
            <FormLabel htmlFor="date" fontWeight="semibold" fontFamily="Inter">Date & Time</FormLabel>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              focusBorderColor="crm-primary.500"
              bg={inputBg}
              _hover={{ borderColor: 'gray.400' }}
              borderRadius="md"
            />
            {errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage>}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="notes" fontWeight="semibold" fontFamily="Inter">Notes (Optional)</FormLabel>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional details or notes"
              focusBorderColor="crm-primary.500"
              bg={inputBg}
              _hover={{ borderColor: 'gray.400' }}
              borderRadius="md"
              rows={4}
            />
          </FormControl>

          <HStack spacing={4} justifyContent="flex-end" mt={4}>
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
              colorScheme="crm-primary"
              isLoading={isLoading}
              leftIcon={<Icon as={FiSave} />}
              _hover={{ bg: 'crm-primary.600', shadow: 'md'}}
              borderRadius="md"
              px={6}
            >
              Log Activity
            </Button>
          </HStack>
        </VStack>
      </chakra.form>
    </Box>
  );
};

export default ActivityLogForm;
