import React, { useState, useEffect } from 'react';
import {
  Box, FormControl, FormLabel, Input, Select, Textarea, Button, SimpleGrid,
  InputGroup, InputLeftElement, Icon, FormErrorMessage, Heading, VStack,
  useColorModeValue, Tooltip, HStack, Text
} from '@chakra-ui/react';
import {
  FiType, FiFileText, FiCalendar, FiFlag, FiCheckSquare, FiUser, FiLink2, FiSave, FiXCircle
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

// Mock data - replace with actual data fetching for users and related entities
const mockUsers = [
  { id: 'user1', name: 'Sales Rep A' },
  { id: 'user2', name: 'Sales Rep B' },
  { id: 'user3', name: 'Manager C' },
];

const mockRelatedEntities = [
  { id: 'lead1', name: 'Lead Alpha', type: 'Lead' },
  { id: 'opp1', name: 'Opportunity Beta', type: 'Opportunity' },
  { id: 'acc1', name: 'Account Gamma', type: 'Account' },
];

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
export type RelatedEntityType = 'Lead' | 'Contact' | 'Account' | 'Opportunity' | 'None';

export interface TaskFormData {
  id?: string;
  title: string;
  description?: string;
  dueDate?: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  assignedToId?: string;
  relatedToType?: RelatedEntityType;
  relatedToId?: string;
  // relatedToName?: string; // For display, if needed
}

interface TaskFormProps {
  initialData?: TaskFormData;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  formTitle?: string;
}

const taskPriorities: TaskPriority[] = ['High', 'Medium', 'Low'];
const taskStatuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];
const relatedEntityTypes: RelatedEntityType[] = ['Lead', 'Contact', 'Account', 'Opportunity', 'None'];

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  formTitle = 'Task Details'
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'Medium',
    status: 'Pending',
    assignedToId: '',
    relatedToType: 'None',
    relatedToId: '',
    ...(initialData || {}),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        dueDate: initialData.dueDate ? format(parseISO(initialData.dueDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof TaskFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    // If relatedToType changes to 'None', clear relatedToId
    if (name === 'relatedToType' && value === 'None') {
      setFormData(prev => ({ ...prev, relatedToId: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.priority) newErrors.priority = 'Priority is required.';
    if (!formData.status) newErrors.status = 'Status is required.';
    if (formData.relatedToType !== 'None' && !formData.relatedToId) {
      newErrors.relatedToId = 'Please select a related item or set type to \'None\'.';
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
          <FormControl isInvalid={!!errors.title} isRequired>
            <FormLabel htmlFor="title" fontWeight="medium">Title</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiType} color="gray.400" />
              </InputLeftElement>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Follow up call with Client X"
                bg={inputBg}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                focusBorderColor={focusBorderColor}
                borderRadius="md"
              />
            </InputGroup>
            {errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage>}
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.status} isRequired>
              <FormLabel htmlFor="status" fontWeight="medium">Status</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiCheckSquare} color="gray.400" />
                </InputLeftElement>
                <Select 
                  id="status" 
                  name="status" 
                  value={formData.status}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                  focusBorderColor={focusBorderColor}
                  borderRadius="md"
                >
                  {taskStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                </Select>
              </InputGroup>
              {errors.status && <FormErrorMessage>{errors.status}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.priority} isRequired>
              <FormLabel htmlFor="priority" fontWeight="medium">Priority</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiFlag} color="gray.400" />
                </InputLeftElement>
                <Select 
                  id="priority" 
                  name="priority" 
                  value={formData.priority}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                  focusBorderColor={focusBorderColor}
                  borderRadius="md"
                >
                  {taskPriorities.map(priority => <option key={priority} value={priority}>{priority}</option>)}
                </Select>
              </InputGroup>
              {errors.priority && <FormErrorMessage>{errors.priority}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.dueDate}>
              <FormLabel htmlFor="dueDate" fontWeight="medium">Due Date</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiCalendar} color="gray.400" />
                </InputLeftElement>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                  focusBorderColor={focusBorderColor}
                  borderRadius="md"
                />
              </InputGroup>
              {errors.dueDate && <FormErrorMessage>{errors.dueDate}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.assignedToId}>
              <FormLabel htmlFor="assignedToId" fontWeight="medium">Assigned To</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiUser} color="gray.400" />
                </InputLeftElement>
                <Select 
                  id="assignedToId" 
                  name="assignedToId" 
                  value={formData.assignedToId}
                  onChange={handleChange}
                  placeholder="Select user"
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                  focusBorderColor={focusBorderColor}
                  borderRadius="md"
                >
                  {mockUsers.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                </Select>
              </InputGroup>
              {errors.assignedToId && <FormErrorMessage>{errors.assignedToId}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.relatedToType}>
              <FormLabel htmlFor="relatedToType" fontWeight="medium">Related To (Type)</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiLink2} color="gray.400" />
                </InputLeftElement>
                <Select 
                  id="relatedToType" 
                  name="relatedToType" 
                  value={formData.relatedToType}
                  onChange={handleChange}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                  focusBorderColor={focusBorderColor}
                  borderRadius="md"
                >
                  {relatedEntityTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </Select>
              </InputGroup>
              {errors.relatedToType && <FormErrorMessage>{errors.relatedToType}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.relatedToId} isDisabled={formData.relatedToType === 'None'}>
              <FormLabel htmlFor="relatedToId" fontWeight="medium">Related To (Item)</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiLink2} color="gray.400" />
                </InputLeftElement>
                <Select 
                  id="relatedToId" 
                  name="relatedToId" 
                  value={formData.relatedToId}
                  onChange={handleChange}
                  placeholder={formData.relatedToType === 'None' ? 'N/A' : `Select ${formData.relatedToType}`}
                  bg={inputBg}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600')}}
                  focusBorderColor={focusBorderColor}
                  borderRadius="md"
                >
                  {/* This should dynamically populate based on relatedToType - simplified for now */}
                  {mockRelatedEntities
                    .filter(entity => formData.relatedToType === 'None' || entity.type === formData.relatedToType)
                    .map(entity => <option key={entity.id} value={entity.id}>{entity.name} ({entity.type})</option>)}
                </Select>
              </InputGroup>
              {errors.relatedToId && <FormErrorMessage>{errors.relatedToId}</FormErrorMessage>}
            </FormControl>

          </SimpleGrid>

          <FormControl isInvalid={!!errors.description}>
            <FormLabel htmlFor="description" fontWeight="medium">Description</FormLabel>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details about the task..."
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
              {initialData ? 'Save Changes' : 'Create Task'}
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};
