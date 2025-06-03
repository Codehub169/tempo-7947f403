import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Icon,
  Link as ChakraLink,
  Text,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import NextLink from 'next/link';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error === "CredentialsSignin" ? "Invalid email or password. Please try again." : result.error);
        setIsLoading(false);
      } else if (result?.ok) {
        // Redirect to dashboard or intended page
        // The session callback in [...nextauth].ts will handle user data
        router.push('/dashboard'); 
      } else {
        setError('An unexpected error occurred. Please try again.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your connection.');
      setIsLoading(false);
    }
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const inputFocusBorderColor = useColorModeValue('crm-primary.500', 'crm-primary.300');

  return (
    <Box bg={cardBg} p={8} borderRadius="xl" boxShadow="xl" w="full" maxW="md">
      <form onSubmit={handleSubmit}>
        <Stack spacing={6}>
          {error && (
            <Alert status="error" borderRadius="md" variant="subtle">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Login Failed!</AlertTitle>
                <AlertDescription display="block">{error}</AlertDescription>
              </Box>
            </Alert>
          )}

          <FormControl id="email">
            <FormLabel color={useColorModeValue('gray.600', 'gray.300')}>Email address</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiMail} color="gray.400" />
              </InputLeftElement>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                bg={inputBg}
                borderColor={useColorModeValue('gray.300', 'gray.600')}
                _hover={{ borderColor: useColorModeValue('gray.400', 'gray.500')}}
                focusBorderColor={inputFocusBorderColor}
                borderRadius="md"
              />
            </InputGroup>
          </FormControl>

          <FormControl id="password">
            <FormLabel color={useColorModeValue('gray.600', 'gray.300')}>Password</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiLock} color="gray.400" />
              </InputLeftElement>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                bg={inputBg}
                borderColor={useColorModeValue('gray.300', 'gray.600')}
                _hover={{ borderColor: useColorModeValue('gray.400', 'gray.500')}}
                focusBorderColor={inputFocusBorderColor}
                borderRadius="md"
              />
              <InputRightElement>
                <IconButton 
                    aria-label={showPassword ? "Hide password" : "Show password"} 
                    icon={showPassword ? <FiEyeOff /> : <FiEye />} 
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="sm"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Stack spacing={4} direction={{ base: 'column', sm: 'row' }} justify="space-between" align="center">
            {/* <Checkbox colorScheme="crm-primary">Remember me</Checkbox> */}
            {/* Placeholder for 'Forgot Password?' link */}
            {/* <NextLink href="/forgot-password" passHref>
              <ChakraLink color={'crm-primary.500'} _hover={{ textDecoration: 'underline' }}>
                Forgot password?
              </ChakraLink>
            </NextLink> */}
          </Stack>

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Signing in..."
            colorScheme="crm-primary"
            variant="solid"
            bg="crm-primary.500"
            color="white"
            _hover={{
              bg: 'crm-primary.600',
              transform: 'translateY(-2px)',
              boxShadow: 'lg'
            }}
            _active={{
              bg: 'crm-primary.700',
              transform: 'translateY(0px)',
            }}
            leftIcon={<FiLogIn />}
            w="full"
            py={6}
            borderRadius="md"
            boxShadow="md"
            transition="all 0.2s ease-in-out"
          >
            Sign In
          </Button>
        </Stack>
      </form>
      {/* Placeholder for 'Sign Up' link */}
      {/* <Text mt={6} textAlign="center" color={useColorModeValue('gray.600', 'gray.400')}>
        Don't have an account?{' '}
        <NextLink href="/register" passHref>
          <ChakraLink color={'crm-primary.500'} fontWeight="medium" _hover={{ textDecoration: 'underline' }}>
            Sign Up
          </ChakraLink>
        </NextLink>
      </Text> */}
    </Box>
  );
};

export default LoginForm;
