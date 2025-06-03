import Head from 'next/head';
import NextLink from 'next/link';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  useColorModeValue, 
  Link 
} from '@chakra-ui/react';
import LoginForm from '@/components/auth/LoginForm';
import type { NextPageWithLayout } from './_app';
import { ReactElement } from 'react';

const LoginPage: NextPageWithLayout = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900'); // Similar to #F8F9FA for light mode
  const cardBgColor = useColorModeValue('white', 'gray.800');
  // Assuming 'crm-primary.600' will be defined in the theme for the blue color #0056B3

  return (
    <>
      <Head>
        <title>Login - ClientFlow CRM</title>
        <meta name="description" content="Login to your ClientFlow CRM account." />
      </Head>
      <Box bg={bgColor} minH="100vh" display="flex" alignItems="center" justifyContent="center" py={12} px={{ base: 4, sm: 6, lg: 8 }}>
        <Container maxW="md" width="100%">
          <VStack spacing={8} alignItems="center">
            <NextLink href="/" passHref>
              <Link _hover={{ textDecoration: 'none' }}>
                <Heading as="h1" size="xl" color={useColorModeValue('crm-primary.600', 'crm-primary.300')} textAlign="center">
                  ClientFlow CRM
                </Heading>
              </Link>
            </NextLink>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')} textAlign="center">
              Sign in to your account
            </Text>
          </VStack>

          <Box 
            mt={10} 
            p={{ base: 6, sm: 8 }} 
            bg={cardBgColor} 
            boxShadow={{ base: 'none', sm: 'xl' }} 
            borderRadius={{ base: 'none', sm: 'lg' }}
          >
            <LoginForm />
            {/* 
            <Text mt={6} textAlign="center" fontSize="sm">
              Don't have an account?{' '}
              <NextLink href="/register" passHref>
                <Link color={useColorModeValue('crm-primary.500', 'crm-primary.300')} fontWeight="medium">
                  Sign up
                </Link>
              </NextLink>
            </Text>
            */}
          </Box>
        </Container>
      </Box>
    </>
  );
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default LoginPage;
