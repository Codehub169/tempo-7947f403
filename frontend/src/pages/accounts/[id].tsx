import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Container,
  Heading,
  Text,
  Spinner,
  Flex,
  VStack,
  HStack,
  Tag,
  Button,
  Icon,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Link as ChakraLink,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import {
  FiBuilding,
  FiInfo,
  FiLink,
  FiPhone,
  FiDollarSign,
  FiUsers,
  FiBriefcase,
  FiCalendar,
  FiEdit,
  FiChevronRight,
  FiActivity,
  FiCheckCircle,
  FiFileText,
  FiPlus,
  FiMapPin,
  FiTrendingUp,
  FiMail,
  FiEye
} from 'react-icons/fi';

// Placeholder types - replace with actual types from src/types/index.ts later
interface IAccountDetail {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  ownerName: string;
  type: 'Prospect' | 'Customer' | 'Partner' | 'Vendor' | 'Other';
  annualRevenue?: number;
  numberOfEmployees?: number;
  billingAddress?: string;
  shippingAddress?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface IRelatedContact {
  id: string;
  name: string;
  email: string;
  jobTitle?: string;
  avatarUrl?: string;
}

interface IRelatedOpportunity {
  id: string;
  name: string;
  stage: string;
  amount: number;
  closeDate: string;
}

// Re-using from other detail pages
interface IActivity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  summary: string;
  date: string;
  user: string;
}

interface ITask {
  id: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
}

const AccountDetailPage = () => {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [account, setAccount] = useState<IAccountDetail | null>(null);
  const [relatedContacts, setRelatedContacts] = useState<IRelatedContact[]>([]);
  const [relatedOpportunities, setRelatedOpportunities] = useState<IRelatedOpportunity[]>([]);
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const primaryColor = 'blue.500';
  const subtleTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Mock data - replace with API calls
  const mockAccountData: { [key: string]: IAccountDetail } = {
    'innovate-solutions-ltd': { 
      id: 'innovate-solutions-ltd', name: 'Innovate Solutions Ltd.', industry: 'Software Development', 
      website: 'https://innovate.com', phone: '040-12345678', ownerName: 'Riya Singh', type: 'Customer', 
      annualRevenue: 50000000, numberOfEmployees: 150, billingAddress: 'Madhapur, Hyderabad, TS, 500081', 
      shippingAddress: 'Gachibowli, Hyderabad, TS, 500032', description: 'Leading provider of custom software solutions for enterprise clients.', 
      createdAt: '2022-05-10T10:00:00Z', updatedAt: '2023-10-22T14:30:00Z' 
    },
    'techgenix-pvt-ltd': { 
      id: 'techgenix-pvt-ltd', name: 'TechGenix Pvt. Ltd.', industry: 'IT Consulting', 
      website: 'https://techgenix.co.in', phone: '080-98765432', ownerName: 'Amit Kumar', type: 'Prospect', 
      annualRevenue: 10000000, numberOfEmployees: 50, billingAddress: 'Koramangala, Bangalore, KA, 560034',
      description: 'Specializes in cloud migration and IT infrastructure services.',
      createdAt: '2023-01-20T11:20:00Z', updatedAt: '2023-10-15T09:15:00Z' 
    },
  };

  const mockContactsForAccount: { [key: string]: IRelatedContact[] } = {
    'innovate-solutions-ltd': [
      { id: '1', name: 'Ananya Iyer', email: 'ananya.iyer@innovate.com', jobTitle: 'Project Manager', avatarUrl: 'https://randomuser.me/api/portraits/women/60.jpg' },
      { id: '5', name: 'Suresh Kumar', email: 'suresh.k@innovate.com', jobTitle: 'CTO', avatarUrl: 'https://randomuser.me/api/portraits/men/65.jpg' },
    ],
    'techgenix-pvt-ltd': [
      { id: '2', name: 'Ravi Chandran', email: 'ravi.chandran@techgenix.com', jobTitle: 'Lead Developer' },
    ],
  };

  const mockOpportunitiesForAccount: { [key: string]: IRelatedOpportunity[] } = {
    'innovate-solutions-ltd': [
      { id: 'opp1', name: 'Project Alpha Implementation', stage: 'Closed Won', amount: 2500000, closeDate: '2023-09-15' },
      { id: 'opp2', name: 'Support Contract Renewal', stage: 'Negotiation', amount: 500000, closeDate: '2023-11-30' },
    ],
    'techgenix-pvt-ltd': [
      { id: 'opp3', name: 'Cloud Migration Assessment', stage: 'Proposal', amount: 200000, closeDate: '2023-12-15' },
    ],
  };

   // Using common mock data structure for activities and tasks
  const mockActivitiesData: { [key: string]: IActivity[] } = {
    'innovate-solutions-ltd': [
      { id: 'act1', type: 'Meeting', summary: 'Quarterly Business Review', date: '2023-09-01', user: 'Riya Singh' },
      { id: 'act2', type: 'Email', summary: 'Sent new service proposal', date: '2023-10-10', user: 'Riya Singh' },
    ]
  };

  const mockTasksData: { [key: string]: ITask[] } = {
    'innovate-solutions-ltd': [
        { id: 'task1', title: 'Follow up on QBR action items', dueDate: '2023-09-15', status: 'Completed' },
        { id: 'task2', title: 'Prepare for support contract negotiation', dueDate: '2023-11-01', status: 'Pending' }
    ]
  };


  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (authStatus === 'authenticated' && id) {
      setIsLoading(true);
      setTimeout(() => {
        const accountData = mockAccountData[id as string];
        if (accountData) {
          setAccount(accountData);
          setRelatedContacts(mockContactsForAccount[id as string] || []);
          setRelatedOpportunities(mockOpportunitiesForAccount[id as string] || []);
          setActivities(mockActivitiesData[id as string] || []);
          setTasks(mockTasksData[id as string] || []);
        } else {
          setAccount(null);
        }
        setIsLoading(false);
      }, 1000);
    }
  }, [authStatus, router, id]);

  const detailItem = (icon: React.ElementType, label: string, value?: string | number, isLink: boolean = false, href?: string) => (
    value ? (
      <Flex align="flex-start" mb={3}>
        <Icon as={icon} mr={3} color={primaryColor} w={5} h={5} mt={1} />
        <Box>
          <Text fontWeight="medium" color={textColor} minW="150px">{label}:</Text>
          {isLink && href ? (
            <NextLink href={href} passHref legacyBehavior>
              <ChakraLink color={primaryColor} _hover={{ textDecoration: 'underline' }} isExternal={href.startsWith('http')}>{value}</ChakraLink>
            </NextLink>
          ) : (
            <Text color={subtleTextColor} whiteSpace="pre-wrap">{value}</Text>
          )}
        </Box>
      </Flex>
    ) : null
  );

  const activityIcon = (type: IActivity['type']) => {
    switch(type) {
      case 'Call': return FiPhone;
      case 'Email': return FiMail;
      case 'Meeting': return FiUsers;
      case 'Note': return FiFileText;
      default: return FiActivity;
    }
  };
  
  const getOpportunityStageColor = (stage: string) => {
    if (stage.toLowerCase().includes('won')) return 'green';
    if (stage.toLowerCase().includes('lost')) return 'red';
    if (stage.toLowerCase().includes('proposal') || stage.toLowerCase().includes('negotiation')) return 'yellow';
    return 'blue';
  };

  if (authStatus === 'loading' || isLoading) {
    return <Flex justify="center" align="center" minH="calc(100vh - 160px)" bg={bgColor}><Spinner size="xl" color={primaryColor} /></Flex>;
  }

  if (!account) {
    return (
      <Container maxW="container.md" py={10} textAlign="center" bg={bgColor}>
        <Heading as="h2" size="lg" mb={4} color={textColor}>Account Not Found</Heading>
        <Text color={subtleTextColor}>The account you are looking for does not exist.</Text>
        <NextLink href="/accounts" passHref legacyBehavior><Button mt={6} colorScheme="blue" as="a">Back to Accounts List</Button></NextLink>
      </Container>
    );
  }

  return (
    <>
      <Head><title>{account.name} | Accounts | ClientFlow CRM</title></Head>
      <Container maxW="container.xl" py={8} bg={bgColor}>
        <Breadcrumb spacing="8px" separator={<Icon as={FiChevronRight} color="gray.500" />} mb={6}>
          <BreadcrumbItem><NextLink href="/dashboard" passHref legacyBehavior><BreadcrumbLink>Dashboard</BreadcrumbLink></NextLink></BreadcrumbItem>
          <BreadcrumbItem><NextLink href="/accounts" passHref legacyBehavior><BreadcrumbLink>Accounts</BreadcrumbLink></NextLink></BreadcrumbItem>
          <BreadcrumbItem isCurrentPage><BreadcrumbLink href={`/accounts/${account.id}`}>{account.name}</BreadcrumbLink></BreadcrumbItem>
        </Breadcrumb>

        <Flex mb={6} align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
            <HStack spacing={4}>
                 <Icon as={FiBuilding} w={10} h={10} color={primaryColor} />
                <VStack align={{ base: 'center', md: 'flex-start' }} spacing={0}>
                    <Heading as="h1" size="xl" color={textColor}>{account.name}</Heading>
                    <Text fontSize="lg" color={subtleTextColor}>{account.industry} - <Tag size="sm" colorScheme={account.type === 'Customer' ? 'green' : 'blue'}>{account.type}</Tag></Text>
                </VStack>
            </HStack>
          <Spacer />
          <Button leftIcon={<FiEdit />} colorScheme="yellow" variant="outline" shadow="sm" _hover={{ shadow: 'md' }}>Edit Account</Button>
        </Flex>

        <Grid templateColumns={{ base: '1fr', lg: '2.5fr 1.5fr' }} gap={6}>
          {/* Left Column: Main Details & Tabs */}
          <GridItem>
            <Card bg={cardBgColor} shadow="lg" borderRadius="xl" mb={6}>
              <CardHeader borderBottomWidth="1px" borderColor={borderColor}><Flex align="center"><Icon as={FiInfo} w={6} h={6} color={primaryColor} mr={3} /><Heading size="md" color={textColor}>Account Overview</Heading></Flex></CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={8} spacingY={4}>
                  {detailItem(FiLink, 'Website', account.website, true, account.website)}
                  {detailItem(FiPhone, 'Phone', account.phone, true, `tel:${account.phone}`)}
                  {detailItem(FiDollarSign, 'Annual Revenue', account.annualRevenue ? `₹${account.annualRevenue.toLocaleString()}` : 'N/A')}
                  {detailItem(FiUsers, 'Employees', account.numberOfEmployees?.toString())}
                  {detailItem(FiUser, 'Account Owner', account.ownerName)}
                  {detailItem(FiCalendar, 'Created At', new Date(account.createdAt).toLocaleDateString())}
                  {detailItem(FiMapPin, 'Billing Address', account.billingAddress)}
                  {detailItem(FiMapPin, 'Shipping Address', account.shippingAddress)}
                </SimpleGrid>
                {account.description && (
                  <Box mt={4} pt={4} borderTopWidth="1px" borderColor={borderColor}>
                    <Heading size="sm" color={textColor} mb={2}>Description</Heading>
                    <Text color={subtleTextColor} whiteSpace="pre-wrap">{account.description}</Text>
                  </Box>
                )}
              </CardBody>
            </Card>

            <Card bg={cardBgColor} shadow="lg" borderRadius="xl">
              <Tabs colorScheme="blue" variant="enclosed-colored">
                <TabList>
                  <Tab _selected={{ bg: primaryColor, color: 'white' }}><Icon as={FiUsers} mr={2}/>Contacts ({relatedContacts.length})</Tab>
                  <Tab _selected={{ bg: primaryColor, color: 'white' }}><Icon as={FiTrendingUp} mr={2}/>Opportunities ({relatedOpportunities.length})</Tab>
                  <Tab _selected={{ bg: primaryColor, color: 'white' }}><Icon as={FiActivity} mr={2}/>Activities ({activities.length})</Tab>
                  <Tab _selected={{ bg: primaryColor, color: 'white' }}><Icon as={FiCheckCircle} mr={2}/>Tasks ({tasks.length})</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Button leftIcon={<FiPlus />} size="sm" colorScheme="blue" variant="outline" mb={4}>Add Contact</Button>
                    {relatedContacts.length > 0 ? (
                        <Table variant="simple" size="sm">
                            <Thead><Tr><Th>Name</Th><Th>Email</Th><Th>Job Title</Th><Th>Actions</Th></Tr></Thead>
                            <Tbody>
                                {relatedContacts.map(contact => (
                                    <Tr key={contact.id}>
                                        <Td py={2}><Flex align="center"><Avatar size="xs" name={contact.name} src={contact.avatarUrl} mr={2}/><NextLink href={`/contacts/${contact.id}`} passHref legacyBehavior><ChakraLink color={primaryColor}>{contact.name}</ChakraLink></Flex></Td>
                                        <Td py={2}>{contact.email}</Td>
                                        <Td py={2}>{contact.jobTitle || '-'}</Td>
                                        <Td py={2}><NextLink href={`/contacts/${contact.id}`} passHref legacyBehavior><Tooltip label="View Contact"><IconButton as="a" icon={<FiEye/>} variant="ghost" size="xs" aria-label="View"/></Tooltip></NextLink></Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    ) : <Text color={subtleTextColor}>No contacts associated with this account.</Text>}
                  </TabPanel>
                  <TabPanel>
                    <Button leftIcon={<FiPlus />} size="sm" colorScheme="blue" variant="outline" mb={4}>Add Opportunity</Button>
                    {relatedOpportunities.length > 0 ? (
                        <Table variant="simple" size="sm">
                            <Thead><Tr><Th>Name</Th><Th>Stage</Th><Th>Amount (₹)</Th><Th>Close Date</Th><Th>Actions</Th></Tr></Thead>
                            <Tbody>
                                {relatedOpportunities.map(opp => (
                                    <Tr key={opp.id}>
                                        <Td py={2}><NextLink href={`/opportunities/${opp.id}`} passHref legacyBehavior><ChakraLink color={primaryColor}>{opp.name}</ChakraLink></NextLink></Td>
                                        <Td py={2}><Tag size="sm" colorScheme={getOpportunityStageColor(opp.stage)}>{opp.stage}</Tag></Td>
                                        <Td py={2} isNumeric>{opp.amount.toLocaleString()}</Td>
                                        <Td py={2}>{new Date(opp.closeDate).toLocaleDateString()}</Td>
                                        <Td py={2}><NextLink href={`/opportunities/${opp.id}`} passHref legacyBehavior><Tooltip label="View Opportunity"><IconButton as="a" icon={<FiEye/>} variant="ghost" size="xs" aria-label="View"/></Tooltip></NextLink></Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    ) : <Text color={subtleTextColor}>No opportunities for this account.</Text>}
                  </TabPanel>
                  <TabPanel>
                     <Button leftIcon={<FiPlus />} size="sm" colorScheme="blue" variant="outline" mb={4}>Log Activity</Button>
                    {activities.length > 0 ? activities.map(act => (
                        <Box key={act.id} p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor} mb={3}>
                          <Flex align="center" mb={1}><Icon as={activityIcon(act.type)} color={primaryColor} mr={2} /><Text fontWeight="bold" color={textColor}>{act.type}</Text></Flex>
                          <Text fontSize="sm" color={textColor}>{act.summary}</Text>
                          <Text fontSize="xs" color={subtleTextColor}>By {act.user} on {new Date(act.date).toLocaleDateString()}</Text>
                        </Box>
                      )) : <Text color={subtleTextColor}>No activities logged yet.</Text>}
                  </TabPanel>
                  <TabPanel>
                    <Button leftIcon={<FiPlus />} size="sm" colorScheme="blue" variant="outline" mb={4}>Add Task</Button>
                    {tasks.length > 0 ? tasks.map(task => (
                        <Box key={task.id} p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor} mb={3}>
                          <Text fontWeight="bold" color={textColor}>{task.title}</Text>
                          <Text fontSize="sm" color={subtleTextColor}>Due: {new Date(task.dueDate).toLocaleDateString()} - Status: <Tag size="sm" colorScheme={task.status === 'Pending' ? 'yellow' : 'green'}>{task.status}</Tag></Text>
                        </Box>
                      )) : <Text color={subtleTextColor}>No tasks for this account.</Text>}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Card>
          </GridItem>

          {/* Right Column: Key Metrics / Quick Actions */}
          <GridItem>
            <VStack spacing={6} align="stretch">
                <Card bg={cardBgColor} shadow="lg" borderRadius="xl">
                    <CardHeader borderBottomWidth="1px" borderColor={borderColor}><Flex align="center"><Icon as={FiDollarSign} w={6} h={6} color="green.500" mr={3} /><Heading size="md" color={textColor}>Sales Summary</Heading></Flex></CardHeader>
                    <CardBody>
                        <Stat mb={4}>
                            <StatLabel color={subtleTextColor}>Total Won Revenue</StatLabel>
                            <StatNumber color="green.600" fontSize="2xl">₹{relatedOpportunities.filter(o => o.stage === 'Closed Won').reduce((sum, o) => sum + o.amount, 0).toLocaleString()}</StatNumber>
                            <StatHelpText>{relatedOpportunities.filter(o => o.stage === 'Closed Won').length} Opportunities Won</StatHelpText>
                        </Stat>
                        <Stat>
                            <StatLabel color={subtleTextColor}>Open Pipeline Value</StatLabel>
                            <StatNumber color="orange.500" fontSize="2xl">₹{relatedOpportunities.filter(o => o.stage !== 'Closed Won' && o.stage !== 'Closed Lost').reduce((sum, o) => sum + o.amount, 0).toLocaleString()}</StatNumber>
                            <StatHelpText>{relatedOpportunities.filter(o => o.stage !== 'Closed Won' && o.stage !== 'Closed Lost').length} Open Opportunities</StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>
                 <Card bg={cardBgColor} shadow="lg" borderRadius="xl">
                    <CardHeader borderBottomWidth="1px" borderColor={borderColor}><Flex align="center"><Icon as={FiMessageSquare} w={6} h={6} color={primaryColor} mr={3} /><Heading size="md" color={textColor}>Quick Actions</Heading></Flex></CardHeader>
                    <CardBody>
                        <VStack spacing={3} align="stretch">
                        <Button colorScheme="blue" leftIcon={<FiPlus/>}>New Opportunity</Button>
                        <Button colorScheme="teal" variant="outline" leftIcon={<FiMail/>}>Send Email to Primary Contact</Button>
                        <Button colorScheme="purple" variant="outline" leftIcon={<FiCheckCircle/>}>Log Interaction</Button>
                        </VStack>
                    </CardBody>
                </Card>
            </VStack>
          </GridItem>
        </Grid>

      </Container>
    </>
  );
};

export default AccountDetailPage;
