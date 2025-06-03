import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Heading,
  useColorModeValue,
  Avatar,
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
  FormErrorMessage,
  useToast,
  Text,
} from '@chakra-ui/react';
import { FiUser, FiMail, FiPhone, FiCamera, FiSave } from 'react-icons/fi';

export interface UserProfileData {
  name: string;
  email: string; // Typically read-only
  phone?: string;
  avatarUrl?: string;
}

interface UserProfileFormProps {
  initialData: UserProfileData;
  onSubmit: (data: UserProfileData) => Promise<void>;
  isLoading?: boolean;
}

/**
 * UserProfileForm: A form component for users to view and update their profile information.
 */
const UserProfileForm: React.FC<UserProfileFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UserProfileData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfileData, string>>>({});
  const toast = useToast();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const focusBorderColor = 'crm-primary.500';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserProfileData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfileData, string>> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }
    // Email is typically not editable or validated here as it's often an identifier
    // Optional: Add phone validation if needed (e.g., regex)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: 'Validation Error',
        description: 'Please check the form for errors.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      await onSubmit(formData);
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: (error as Error).message || 'Could not update profile. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg={cardBg}
      p={{ base: 6, md: 8 }}
      borderRadius="xl"
      boxShadow="xl"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading as="h2" size="lg" fontFamily="Poppins" textAlign="center">
          My Profile
        </Heading>

        <Flex direction="column" align="center" w="full">
          <Avatar size="xl" name={formData.name} src={formData.avatarUrl} mb={3} showBorder borderColor="crm-primary.500">
            {!formData.avatarUrl && <Icon as={FiUser} w={10} h={10} />}
          </Avatar>
          {/* For simplicity, avatar URL is an input. Real app might use file upload. */}
          <FormControl id="avatarUrl">
            <FormLabel fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>Avatar URL (Optional)</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiCamera} color="gray.400" />
              </InputLeftElement>
              <Input
                name="avatarUrl"
                type="text"
                value={formData.avatarUrl || ''}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                bg={inputBg}
                borderColor={borderColor}
                _hover={{ borderColor: useColorModeValue('gray.300', 'gray.500') }}
                focusBorderColor={focusBorderColor}
              />
            </InputGroup>
          </FormControl>
        </Flex>

        <FormControl id="name" isInvalid={!!errors.name} isRequired>
          <FormLabel>Full Name</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiUser} color="gray.400" />
            </InputLeftElement>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              bg={inputBg}
              borderColor={borderColor}
              _hover={{ borderColor: useColorModeValue('gray.300', 'gray.500') }}
              focusBorderColor={focusBorderColor}
            />
          </InputGroup>
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </FormControl>

        <FormControl id="email">
          <FormLabel>Email Address</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiMail} color="gray.400" />
            </InputLeftElement>
            <Input
              name="email"
              type="email"
              value={formData.email}
              isReadOnly // Email is usually not editable
              bg={useColorModeValue('gray.100', 'gray.700')} // Different background for read-only
              borderColor={borderColor}
              _hover={{ borderColor: useColorModeValue('gray.300', 'gray.500') }}
              focusBorderColor={focusBorderColor}
              opacity={0.7}
              cursor="not-allowed"
            />
          </InputGroup>
          <Text fontSize="xs" color="gray.500" mt={1}>Email address cannot be changed.</Text>
        </FormControl>

        <FormControl id="phone">
          <FormLabel>Phone Number (Optional)</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiPhone} color="gray.400" />
            </InputLeftElement>
            <Input
              name="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="+91 12345 67890"
              bg={inputBg}
              borderColor={borderColor}
              _hover={{ borderColor: useColorModeValue('gray.300', 'gray.500') }}
              focusBorderColor={focusBorderColor}
            />
          </InputGroup>
        </FormControl>

        <Button
          type="submit"
          colorScheme="crm-primary"
          isLoading={isLoading}
          loadingText="Saving..."
          size="lg"
          fontSize="md"
          w="full"
          leftIcon={<FiSave />}
          boxShadow="md"
          _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
          _active={{ transform: 'translateY(0)' }}
        >
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
};

export default UserProfileForm;
