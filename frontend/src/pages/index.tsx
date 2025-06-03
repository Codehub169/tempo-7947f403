import Head from 'next/head';
import NextLink from 'next/link';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  Icon, 
  useColorModeValue 
} from '@chakra-ui/react';
import { FiLogIn } from 'react-icons/fi';
import type { NextPageWithLayout } from './_app';

const HomePage: NextPageWithLayout = () => {
  const textColor = useColorModeValue('gray.700', 'gray.200');
  // Assuming 'crm-primary.600' and 'crm-primary.500' will be defined in the theme for the blue color #0056B3
  // Assuming 'crm-secondary.50' will be defined for light backgrounds like #F8F9FA

  return (
    <>
      <Head>
        <title>Welcome to ClientFlow CRM</title>
        <meta name="description" content="ClientFlow CRM - Streamline Your Sales and Client Management for your IT Company." />
      </Head>
      <Container maxW="container.lg" py={{ base: '12', md: '24' }} centerContent>
        <VStack spacing={{ base: 6, md: 8 }} textAlign="center">
          <Box>
            <Heading as="h1" size="2xl" fontWeight="bold" color={useColorModeValue('crm-primary.600', 'crm-primary.300')}>
              Welcome to ClientFlow CRM
            </Heading>
            <Text mt={4} fontSize="lg" color={textColor}>
              The End-to-End Solution to Supercharge Your Indian IT Company's Sales and Client Relationships.
            </Text>
          </Box>

          <Text fontSize="md" color={textColor} maxW="xl">
            Tired of juggling spreadsheets and scattered notes? ClientFlow CRM centralizes your leads, contacts, opportunities, and tasks into one intuitive platform. Boost productivity, gain clear insights, and focus on what matters most: growing your business.
          </Text>

          <NextLink href="/login" passHref>
            <Button 
              as="a"
              size="lg" 
              colorScheme="crm-primary" 
              bg={useColorModeValue('crm-primary.500', 'crm-primary.600')} 
              color="white"
              _hover={{
                bg: useColorModeValue('crm-primary.600', 'crm-primary.700'),
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              rightIcon={<Icon as={FiLogIn} />}
              px={8}
              py={6}
              boxShadow="md"
              transition="all 0.2s ease-in-out"
            >
              Login to Get Started
            </Button>
          </NextLink>
        </VStack>
      </Container>
    </>
  );
};

export default HomePage;
