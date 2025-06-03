import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { 
  Container, 
  Heading, 
  Text, 
  Spinner, 
  Box, 
  Grid, 
  GridItem, 
  Card, 
  CardHeader, 
  CardBody, 
  Stack, 
  Button, 
  Tag, 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel, 
  Flex, 
  Avatar, 
  Icon, 
  useColorModeValue, 
  SimpleGrid,
  Link as ChakraLink,
  IconButton,
  Badge,
  Divider
} from '@chakra-ui/react';
import { FiChevronRight, FiDollarSign, FiTarget, FiBriefcase, FiCalendar, FiUsers, FiFileText, FiActivity, FiCheckCircle, FiAlertTriangle, FiXCircle, FiEdit, FiPlus, FiMessageSquare, FiPhone, FiMail, FiLink, FiInfo, FiUser, FiList, FiTrendingUp } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import NextLink from 'next/link';
import { ReactElement, useEffect, useState } from 'react';
import { Layout } from '@/components/common/Layout';

// Mock data - replace with API calls
interface Opportunity {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  amount: number;
  stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  closeDate: string;
  ownerId: string;
  ownerName: string;
  probability?: number;
  description?: string;
  nextSteps?: string;
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  summary: string;
  date: string;
  userId: string;
  userName: string;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assigneeName?: string;
}

const mockOpportunities: Opportunity[] = [
  {
    id: 'opp123',
    name: 'Major Cloud Migration Project',
    accountId: 'acc456',
    accountName: 'Tech Solutions Inc.',
    amount: 150000,
    stage: 'Proposal',
    closeDate: '2024-08-30',
    ownerId: 'user789',
    ownerName: 'Sarah Miller',
    probability: 60,
    description: 'Comprehensive cloud migration for client\'s entire infrastructure. Includes AWS setup, data transfer, and staff training.',
    nextSteps: 'Follow up on proposal feedback by EOW. Schedule final demo for next week.',
    createdAt: '2024-05-10T10:00:00Z',
    updatedAt: '2024-06-15T14:30:00Z',
  },
  {
    id: 'opp456',
    name: 'CRM Implementation for RetailCo',
    accountId: 'acc789',
    accountName: 'RetailCo Global',
    amount: 75000,
    stage: 'Closed Won',
    closeDate: '2024-04-15',
    ownerId: 'user123',
    ownerName: 'John Doe',
    probability: 100,
    description: 'Custom CRM setup and integration.',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-04-15T16:00:00Z',
  },
];

const mockActivities: Activity[] = [
  { id: 'act1', type: 'Call', summary: 'Discussed proposal details and pricing.', date: '2024-06-14T11:00:00Z', userId: 'user789', userName: 'Sarah Miller' },
  { id: 'act2', type: 'Email', summary: 'Sent updated proposal document.', date: '2024-06-10T17:30:00Z', userId: 'user789', userName: 'Sarah Miller' },
  { id: 'act3', type: 'Meeting', summary: 'Initial project scope meeting with stakeholders.', date: '2024-05-20T14:00:00Z', userId: 'user789', userName: 'Sarah Miller' },
];

const mockTasks: Task[] = [
  { id: 'task1', title: 'Prepare final contract', dueDate: '2024-06-25', status: 'In Progress', assigneeName: 'Sarah Miller' },
  { id: 'task2', title: 'Schedule follow-up call', dueDate: '2024-06-28', status: 'Pending', assigneeName: 'Sarah Miller' },
];

const getStageTagColorScheme = (stage: Opportunity['stage']) => {
  switch (stage) {
    case 'Prospecting': return 'gray';
    case 'Qualification': return 'blue';
    case 'Proposal': return 'orange';
    case 'Negotiation': return 'purple';
    case 'Closed Won': return 'green';
    case 'Closed Lost': return 'red';
    default: return 'gray';
  }
};

const getStageIcon = (stage: Opportunity['stage']) => {
  switch (stage) {
    case 'Prospecting': return FiTarget;
    case 'Qualification': return FiUsers;
    case 'Proposal': return FiFileText;
    case 'Negotiation': return FiDollarSign;
    case 'Closed Won': return FiCheckCircle;
    case 'Closed Lost': return FiXCircle;
    default: return FiActivity;
  }
};

const DetailItem = ({ icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) => (
  <Flex align="center" mb={2}>
    <Icon as={icon} mr={3} color="gray.500" boxSize={5} />
    <Box>
      <Text fontSize="sm" color="gray.500" fontWeight="medium">{label}</Text>
      <Text fontWeight="medium">{children || '-'}</Text>
    </Box>
  </Flex>
);

const OpportunityDetailPage: NextPage & { getLayout?: (page: ReactElement) => ReactElement } = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const subtleTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    if (id) {
      // Simulate API call
      setTimeout(() => {
        const foundOpportunity = mockOpportunities.find(op => op.id === id);
        if (foundOpportunity) {
          setOpportunity(foundOpportunity);
          setActivities(mockActivities); // Filter these by opportunityId in a real app
          setTasks(mockTasks); // Filter these by opportunityId in a real app
        } else {
          setOpportunity(null); // Handle not found
        }
        setIsLoading(false);
      }, 1000);
    }
  }, [id, session, status, router]);

  if (isLoading || status === 'loading') {
    return (
      <Flex justify="center" align="center" minH="calc(100vh - 120px)">
        <Spinner size="xl" color="crm-primary.500" />
      </Flex>
    );
  }

  if (!opportunity) {
    return (
      <Container maxW="container.lg" py={8}>
        <Flex direction="column" align="center" justify="center" minH="calc(100vh - 200px)">
          <Icon as={FiAlertTriangle} boxSize={16} color="crm-warning.500" mb={4} />
          <Heading as="h2" size="lg" mb={2}>Opportunity Not Found</Heading>
          <Text mb={4}>The opportunity you are looking for does not exist or has been moved.</Text>
          <NextLink href="/opportunities" passHref>
            <Button as="a" colorScheme="crm-primary">Go to Opportunities</Button>
          </NextLink>
        </Flex>
      </Container>
    );
  }

  const isClosed = opportunity.stage === 'Closed Won' || opportunity.stage === 'Closed Lost';

  return (
    <>
      <Head>
        <title>{`${opportunity.name} | Opportunity Details | ClientFlow CRM`}</title>
        <meta name="description" content={`Details for opportunity: ${opportunity.name}`} />
      </Head>

      <Container maxW="container.xl" py={8} px={{ base: 4, md: 8 }}>
        <Breadcrumb spacing="8px" separator={<FiChevronRight color="gray.500" />} mb={6}>
          <BreadcrumbItem>
            <NextLink href="/dashboard" passHref>
              <BreadcrumbLink>Dashboard</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <NextLink href="/opportunities" passHref>
              <BreadcrumbLink>Opportunities</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href={`/opportunities/${opportunity.id}`} isTruncated maxW="300px">
              {opportunity.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Flex direction={{ base: 'column', lg: 'row' }} justify="space-between" align="flex-start" mb={6}>
          <Box flexGrow={1}>
            <Flex align="center" mb={1}>
              <Icon as={FiTarget} color="crm-primary.500" boxSize={8} mr={3} />
              <Heading as="h1" size="xl" fontWeight="bold" color={textColor} isTruncated maxW="calc(100% - 150px)">
                {opportunity.name}
              </Heading>
            </Flex>
            <Tag 
              size="lg" 
              variant="subtle"
              colorScheme={getStageTagColorScheme(opportunity.stage)}
              ml={12} 
              mb={4}
              px={3} py={1.5}
              borderRadius="md"
            >
              <Icon as={getStageIcon(opportunity.stage)} mr={2} />
              {opportunity.stage}
            </Tag>
          </Box>
          <Button 
            leftIcon={<FiEdit />} 
            colorScheme="crm-primary" 
            variant="outline"
            size="md"
            onClick={() => { /* Open edit modal */ }}
            isDisabled // Placeholder
            mt={{ base: 4, lg: 0 }}
          >
            Edit Opportunity
          </Button>
        </Flex>

        <Grid templateColumns={{ base: '1fr', lg: '2.5fr 1.5fr' }} gap={6}>
          <GridItem>
            <Stack spacing={6}>
              <Card shadow="lg" borderRadius="lg" bg={cardBg} borderColor={borderColor} borderWidth={1}>
                <CardHeader pb={2}>
                  <Heading size="md" color={textColor}>Opportunity Details</Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                    <DetailItem icon={FiBriefcase} label="Account">
                      <NextLink href={`/accounts/${opportunity.accountId}`} passHref>
                        <ChakraLink color="crm-primary.500" fontWeight="bold">{opportunity.accountName}</ChakraLink>
                      </NextLink>
                    </DetailItem>
                    <DetailItem icon={FiDollarSign} label="Amount">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(opportunity.amount)}
                    </DetailItem>
                    <DetailItem icon={FiCalendar} label="Expected Close Date">
                      {format(parseISO(opportunity.closeDate), 'dd MMM, yyyy')}
                    </DetailItem>
                    <DetailItem icon={FiUser} label="Opportunity Owner">
                      {opportunity.ownerName}
                    </DetailItem>
                    {opportunity.probability !== undefined && (
                      <DetailItem icon={FiTrendingUp} label="Probability">
                        {opportunity.probability}%
                      </DetailItem>
                    )}
                     <DetailItem icon={FiCalendar} label="Created At">
                      {format(parseISO(opportunity.createdAt), 'dd MMM, yyyy HH:mm')}
                    </DetailItem>
                  </SimpleGrid>
                  {opportunity.description && (
                    <Box mt={6}>
                      <Heading size="sm" color={subtleTextColor} mb={2}>Description</Heading>
                      <Text whiteSpace="pre-wrap" color={textColor}>{opportunity.description}</Text>
                    </Box>
                  )}
                  {opportunity.nextSteps && (
                    <Box mt={6}>
                      <Heading size="sm" color={subtleTextColor} mb={2}>Next Steps</Heading>
                      <Text whiteSpace="pre-wrap" color={textColor}>{opportunity.nextSteps}</Text>
                    </Box>
                  )}
                </CardBody>
              </Card>

              <Card shadow="lg" borderRadius="lg" bg={cardBg} borderColor={borderColor} borderWidth={1}>
                <CardHeader>
                   <Flex justify="space-between" align="center">
                    <Heading size="md" color={textColor}>Activity & Tasks</Heading>
                     {/* Add buttons might go here or inside tabs */}
                  </Flex>
                </CardHeader>
                <CardBody p={0}>
                  <Tabs variant="enclosed-colored" colorScheme="crm-primary">
                    <TabList px={{ base: 2, md: 6}}>
                      <Tab fontWeight="semibold">Activities ({activities.length})</Tab>
                      <Tab fontWeight="semibold">Tasks ({tasks.length})</Tab>
                      <Tab fontWeight="semibold">Notes (0)</Tab> {/* Placeholder */}
                    </TabList>
                    <TabPanels>
                      <TabPanel px={{ base: 2, md: 6}} py={4}>
                        <Flex justify="flex-end" mb={4}>
                            <Button leftIcon={<FiPlus />} colorScheme="crm-accent" size="sm" isDisabled>Log Activity</Button>
                        </Flex>
                        {activities.length > 0 ? (
                          <Stack spacing={4} divider={<Divider borderColor={borderColor} />}>
                            {activities.map(activity => (
                              <Box key={activity.id} py={3}>
                                <Flex align="center" justify="space-between" mb={1}>
                                  <Flex align="center">
                                    <Icon as={activity.type === 'Call' ? FiPhone : activity.type === 'Email' ? FiMail : FiMessageSquare} mr={2} color="crm-primary.500" />
                                    <Text fontWeight="bold" color={textColor}>{activity.type}</Text>
                                  </Flex>
                                  <Text fontSize="xs" color={subtleTextColor}>{format(parseISO(activity.date), 'dd MMM, yyyy HH:mm')}</Text>
                                </Flex>
                                <Text fontSize="sm" color={textColor} mb={1}>{activity.summary}</Text>
                                <Text fontSize="xs" color={subtleTextColor}>Logged by: {activity.userName}</Text>
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text color={subtleTextColor}>No activities logged yet.</Text>
                        )}
                      </TabPanel>
                      <TabPanel px={{ base: 2, md: 6}} py={4}>
                        <Flex justify="flex-end" mb={4}>
                            <Button leftIcon={<FiPlus />} colorScheme="crm-accent" size="sm" isDisabled>Add Task</Button>
                        </Flex>
                        {tasks.length > 0 ? (
                          <Stack spacing={4} divider={<Divider borderColor={borderColor} />}>
                            {tasks.map(task => (
                              <Box key={task.id} py={3}>
                                <Flex align="center" justify="space-between">
                                  <Text fontWeight="bold" color={textColor}>{task.title}</Text>
                                  <Tag size="sm" colorScheme={task.status === 'Completed' ? 'green' : task.status === 'In Progress' ? 'yellow' : 'gray'}>{task.status}</Tag>
                                </Flex>
                                <Text fontSize="sm" color={subtleTextColor}>Due: {format(parseISO(task.dueDate), 'dd MMM, yyyy')}</Text>
                                {task.assigneeName && <Text fontSize="xs" color={subtleTextColor}>Assignee: {task.assigneeName}</Text>}
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text color={subtleTextColor}>No tasks found for this opportunity.</Text>
                        )}
                      </TabPanel>
                      <TabPanel px={{ base: 2, md: 6}} py={4}>
                        <Text color={subtleTextColor}>Notes feature coming soon.</Text>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={6}>
              <Card shadow="lg" borderRadius="lg" bg={cardBg} borderColor={borderColor} borderWidth={1}>
                <CardHeader><Heading size="md" color={textColor}>Sales Stage Actions</Heading></CardHeader>
                <CardBody>
                  <Text fontSize="sm" color={subtleTextColor} mb={1}>Current Stage:</Text>
                  <Tag size="lg" variant="solid" colorScheme={getStageTagColorScheme(opportunity.stage)} mb={4} w="full" justifyContent="center" py={2}>
                     <Icon as={getStageIcon(opportunity.stage)} mr={2} /> {opportunity.stage}
                  </Tag>
                  <Stack spacing={3}>
                    <Button colorScheme="green" isDisabled={isClosed} leftIcon={<FiCheckCircle />}>Mark as Closed Won</Button>
                    <Button colorScheme="red" isDisabled={isClosed} leftIcon={<FiXCircle />}>Mark as Closed Lost</Button>
                  </Stack>
                </CardBody>
              </Card>

              <Card shadow="lg" borderRadius="lg" bg={cardBg} borderColor={borderColor} borderWidth={1}>
                <CardHeader><Heading size="md" color={textColor}>Related Account</Heading></CardHeader>
                <CardBody>
                  <Flex align="center">
                    <Avatar name={opportunity.accountName} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(opportunity.accountName)}&background=0056B3&color=fff`} mr={3} />
                    <Box>
                      <NextLink href={`/accounts/${opportunity.accountId}`} passHref>
                        <ChakraLink fontWeight="bold" color="crm-primary.500" fontSize="lg">{opportunity.accountName}</ChakraLink>
                      </NextLink>
                      {/* Could add account type or industry here */}
                    </Box>
                  </Flex>
                </CardBody>
              </Card>

              <Card shadow="lg" borderRadius="lg" bg={cardBg} borderColor={borderColor} borderWidth={1}>
                <CardHeader><Heading size="md" color={textColor}>Quick Actions</Heading></CardHeader>
                <CardBody>
                  <Stack spacing={3}>
                    <Button leftIcon={<FiPlus />} variant="outline" colorScheme="crm-primary" isDisabled>New Task for Opportunity</Button>
                    <Button leftIcon={<FiMessageSquare />} variant="outline" colorScheme="crm-primary" isDisabled>Log Interaction</Button>
                    <Button leftIcon={<FiMail />} variant="outline" colorScheme="crm-primary" isDisabled>Send Email to Contact</Button>
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
};

OpportunityDetailPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>; 
};

export default OpportunityDetailPage;
