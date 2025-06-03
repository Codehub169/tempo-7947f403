import { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { 
  Container, 
  Heading, 
  Text, 
  Spinner, 
  Box, 
  Flex, 
  Icon, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel, 
  useColorModeValue,
  Card, CardBody, CardHeader,
  Button, Stack, FormControl, FormLabel, Input, Switch, VStack, Divider, SimpleGrid
} from '@chakra-ui/react';
import { FiSettings, FiUser, FiBell, FiShield, FiUsers, FiCreditCard, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import { Layout } from '@/components/common/Layout';
// import UserProfileForm from '@/components/settings/UserProfileForm'; // Placeholder for actual form component

const SettingsPage: NextPage & { getLayout?: (page: ReactElement) => ReactElement } = () => {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const subtleTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (authStatus === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    // Simulate loading user settings or admin data
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [session, authStatus, router]);

  if (isLoading || authStatus === 'loading') {
    return (
      <Flex justify="center" align="center" minH="calc(100vh - 120px)">
        <Spinner size="xl" color="crm-primary.500" />
      </Flex>
    );
  }

  // Mock user data - replace with session.user or API call
  const user = {
    name: session?.user?.name || 'Demo User',
    email: session?.user?.email || 'demo@example.com',
    role: 'Administrator' // or 'Sales Rep'
  };

  return (
    <>
      <Head>
        <title>Settings | ClientFlow CRM</title>
        <meta name="description" content="Manage your profile, preferences, and application settings." />
      </Head>

      <Container maxW="container.xl" py={8} px={{ base: 4, md: 8 }}>
        <Flex align="center" mb={8}>
          <Icon as={FiSettings} color="crm-primary.500" boxSize={8} mr={3} />
          <Heading as="h1" size="xl" fontWeight="bold" color={textColor}>
            Settings
          </Heading>
        </Flex>

        <Tabs variant="enclosed-colored" colorScheme="crm-primary" orientation="vertical">
          <TabList w={{ base: 'full', md: '250px' }} mr={{ md: 8 }} mb={{ base: 4, md: 0 }} borderRightWidth={{ md: '1px' }} borderColor={borderColor}>
            <Tab fontWeight="semibold"><Icon as={FiUser} mr={2} /> Profile</Tab>
            <Tab fontWeight="semibold"><Icon as={FiBell} mr={2} /> Notifications</Tab>
            <Tab fontWeight="semibold"><Icon as={FiShield} mr={2} /> Security</Tab>
            {user.role === 'Administrator' && (
              <Tab fontWeight="semibold"><Icon as={FiUsers} mr={2} /> Team Management</Tab>
            )}
            <Tab fontWeight="semibold"><Icon as={FiCreditCard} mr={2} /> Subscription</Tab>
            <Tab fontWeight="semibold"><Icon as={FiHelpCircle} mr={2} /> Help & Support</Tab>
          </TabList>

          <TabPanels flexGrow={1}>
            <TabPanel>
              <Card bg={cardBg} shadow="lg" borderRadius="lg" borderColor={borderColor} borderWidth={1}>
                <CardHeader><Heading size="md" color={textColor}>My Profile</Heading></CardHeader>
                <CardBody>
                  {/* <UserProfileForm user={user} /> */}
                  <VStack spacing={6} align="stretch">
                    <FormControl id="fullName">
                      <FormLabel color={subtleTextColor}>Full Name</FormLabel>
                      <Input type="text" defaultValue={user.name} bg={useColorModeValue('gray.50', 'gray.800')} />
                    </FormControl>
                    <FormControl id="email">
                      <FormLabel color={subtleTextColor}>Email Address</FormLabel>
                      <Input type="email" defaultValue={user.email} isReadOnly bg={useColorModeValue('gray.100', 'gray.900')} />
                    </FormControl>
                    <FormControl id="role">
                      <FormLabel color={subtleTextColor}>Role</FormLabel>
                      <Input type="text" defaultValue={user.role} isReadOnly bg={useColorModeValue('gray.100', 'gray.900')} />
                    </FormControl>
                    <Divider />
                    <Button colorScheme="crm-primary" alignSelf="flex-start" shadow="md" _hover={{shadow: "lg"}} isDisabled>Save Changes</Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel>
              <Card bg={cardBg} shadow="lg" borderRadius="lg" borderColor={borderColor} borderWidth={1}>
                <CardHeader><Heading size="md" color={textColor}>Notification Preferences</Heading></CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="email-notifications" mb="0" color={subtleTextColor} flexGrow={1}>
                        Email Notifications for New Leads
                      </FormLabel>
                      <Switch id="email-notifications" colorScheme="crm-primary" defaultChecked isDisabled />
                    </FormControl>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="task-reminders" mb="0" color={subtleTextColor} flexGrow={1}>
                        Task Due Date Reminders (In-App)
                      </FormLabel>
                      <Switch id="task-reminders" colorScheme="crm-primary" defaultChecked isDisabled />
                    </FormControl>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="weekly-summary" mb="0" color={subtleTextColor} flexGrow={1}>
                        Weekly Performance Summary Email
                      </FormLabel>
                      <Switch id="weekly-summary" colorScheme="crm-primary" isDisabled />
                    </FormControl>
                    <Divider />
                     <Button colorScheme="crm-primary" alignSelf="flex-start" shadow="md" _hover={{shadow: "lg"}} isDisabled>Save Preferences</Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel>
              <Card bg={cardBg} shadow="lg" borderRadius="lg" borderColor={borderColor} borderWidth={1}>
                <CardHeader><Heading size="md" color={textColor}>Security Settings</Heading></CardHeader>
                <CardBody>
                   <VStack spacing={6} align="stretch">
                    <Button variant="outline" colorScheme="crm-primary" isDisabled>Change Password</Button>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="2fa" mb="0" color={subtleTextColor} flexGrow={1}>
                        Two-Factor Authentication (2FA)
                      </FormLabel>
                      <Switch id="2fa" colorScheme="crm-primary" isDisabled />
                    </FormControl>
                    <Text color={subtleTextColor} fontSize="sm">For enhanced security, we recommend enabling 2FA.</Text>
                    <Divider />
                    <Heading size="sm" color={textColor} mt={4}>Login History</Heading>
                    <Text color={subtleTextColor} fontSize="sm">Feature coming soon. You'll be able to see recent login attempts here.</Text>
                   </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {user.role === 'Administrator' && (
              <TabPanel>
                <Card bg={cardBg} shadow="lg" borderRadius="lg" borderColor={borderColor} borderWidth={1}>
                  <CardHeader>
                     <Flex justifyContent="space-between" alignItems="center">
                        <Heading size="md" color={textColor}>Team Management</Heading>
                        <Button leftIcon={<FiUser />} colorScheme="crm-accent" size="sm" isDisabled>Invite User</Button>
                     </Flex>
                    </CardHeader>
                  <CardBody>
                    <Text color={subtleTextColor}>Manage your team members, roles, and permissions. (Placeholder)</Text>
                    {/* Placeholder for user list table */}
                    <Box mt={4} p={4} bg={useColorModeValue('gray.50', 'gray.800')} borderRadius="md">
                        <Text color={subtleTextColor}>User list and role management will appear here.</Text>
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>
            )}
            
            <TabPanel>
                 <Card bg={cardBg} shadow="lg" borderRadius="lg" borderColor={borderColor} borderWidth={1}>
                    <CardHeader><Heading size="md" color={textColor}>Subscription & Billing</Heading></CardHeader>
                    <CardBody>
                        <Text color={subtleTextColor} mb={4}>Manage your ClientFlow CRM subscription plan and view billing history.</Text>
                        <SimpleGrid columns={{base: 1, md: 2}} spacing={6} mb={6}>
                            <Box p={4} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                                <Heading size="sm" color={textColor} mb={2}>Current Plan</Heading>
                                <Text fontWeight="bold" fontSize="xl" color="crm-primary.500">Professional Tier</Text>
                                <Text color={subtleTextColor}>Renews on: August 1, 2024</Text>
                            </Box>
                             <Box p={4} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                                <Heading size="sm" color={textColor} mb={2}>Next Bill</Heading>
                                <Text fontWeight="bold" fontSize="xl">₹5,000</Text>
                                <Text color={subtleTextColor}>Includes 5 users</Text>
                            </Box>
                        </SimpleGrid>
                        <Stack direction={{base: "column", md: "row"}} spacing={4}>
                            <Button colorScheme="crm-primary" variant="outline" isDisabled>Change Plan</Button>
                            <Button colorScheme="gray" isDisabled>View Billing History</Button>
                        </Stack>
                    </CardBody>
                 </Card>
            </TabPanel>

             <TabPanel>
                 <Card bg={cardBg} shadow="lg" borderRadius="lg" borderColor={borderColor} borderWidth={1}>
                    <CardHeader><Heading size="md" color={textColor}>Help & Support</Heading></CardHeader>
                    <CardBody>
                        <Text color={subtleTextColor} mb={4}>Find answers to your questions or get in touch with our support team.</Text>
                        <VStack spacing={4} align="start">
                            <Button variant="link" colorScheme="crm-primary"isDisabled>Knowledge Base</Button>
                            <Button variant="link" colorScheme="crm-primary" isDisabled>FAQ</Button>
                            <Button variant="link" colorScheme="crm-primary" isDisabled>Contact Support</Button>
                            <Button variant="link" colorScheme="crm-primary" isDisabled>Submit Feedback</Button>
                        </VStack>
                         <Divider my={6} />
                         <Button colorScheme="red" variant="outline" leftIcon={<FiLogOut />} isDisabled>Logout from All Devices</Button>
                    </CardBody>
                 </Card>
            </TabPanel>

          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
};

SettingsPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default SettingsPage;
