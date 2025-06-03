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
  Avatar,
  HStack,
  Divider,
} from '@chakra-ui/react';
import {
  FiUser,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiActivity,
  FiInfo,
  FiCalendar,
  FiEdit,
  FiChevronRight,
  FiMessageSquare,
  FiCheckCircle,
  FiFileText,
  FiLink,
  FiBuilding,
} from 'react-icons/fi';

// Placeholder type - replace with actual type from src/types/index.ts later
interface IContactDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  accountName: string;
  accountId: string; // To link to the account page
  linkedinProfile?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  avatarUrl?: string;
}

// Placeholder related data types (similar to Lead detail)
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

const ContactDetailPage = () => {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [contact, setContact] = useState<IContactDetail | null>(null);
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const primaryColor = 'blue.500'; // Corresponds to crm-primary
  const subtleTextColor = useColorModeValue('gray.600', 'gray.400');

  // Mock data - replace with API calls
  const mockContactsData: { [key: string]: IContactDetail } = {
    '1': { id: '1', name: 'Ananya Iyer', email: 'ananya.iyer@innovate.com', phone: '9876500001', jobTitle: 'Project Manager', department: 'Technology', accountName: 'Innovate Solutions Ltd.', accountId: 'innovate-solutions-ltd', linkedinProfile: 'https://linkedin.com/in/ananyaiyer', createdAt: '2023-08-15T09:30:00Z', updatedAt: '2023-10-20T11:00:00Z', notes: 'Key contact for Project Alpha. Prefers email communication.', avatarUrl: 'https://randomuser.me/api/portraits/women/60.jpg' },
    '2': { id: '2', name: 'Ravi Chandran', email: 'ravi.chandran@techgenix.com', phone: '9123400002', jobTitle: 'Lead Developer', department: 'Engineering', accountName: 'TechGenix Pvt. Ltd.', accountId: 'techgenix-pvt-ltd', createdAt: '2023-07-20T14:00:00Z', updatedAt: '2023-10-18T16:45:00Z', avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg' },
  };

  const mockActivitiesData: { [key: string]: IActivity[] } = {
    '1': [
      { id: 'act1', type: 'Email', summary: 'Discussed project timeline.', date: '2023-10-18', user: 'Riya Singh' },
      { id: 'act2', type: 'Meeting', summary: 'Quarterly Review Meeting.', date: '2023-09-25', user: 'Amit Kumar' },
    ],
    '2': [],
  };

  const mockTasksData: { [key: string]: ITask[] } = {
    '1': [{ id: 'task1', title: 'Send follow-up email to Ananya', dueDate: '2023-10-25', status: 'Pending' }],
    '2': [{ id: 'task2', title: 'Review PR by Ravi', dueDate: '2023-10-20', status: 'Completed' }],
  };

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (authStatus === 'authenticated' && id) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const contactData = mockContactsData[id as string];
        if (contactData) {
          setContact(contactData);
          setActivities(mockActivitiesData[id as string] || []);
          setTasks(mockTasksData[id as string] || []);
        } else {
          setContact(null);
        }
        setIsLoading(false);
      }, 1000);
    }
  }, [authStatus, router, id]);

  if (authStatus === 'loading' || isLoading) {
    return (
      <Flex justify="center" align="center" minH="calc(100vh - 160px)" bg={bgColor}>
        <Spinner size="xl" color={primaryColor} />
      </Flex>
    );
  }

  if (!contact) {
    return (
      <Container maxW="container.md" py={10} textAlign="center" bg={bgColor}>
        <Heading as="h2" size="lg" mb={4} color={textColor}>Contact Not Found</Heading>
        <Text color={subtleTextColor}>The contact you are looking for does not exist or could not be loaded.</Text>
        <NextLink href="/contacts" passHref legacyBehavior>
          <Button mt={6} colorScheme="blue" as="a">Back to Contacts List</Button>
        </NextLink>
      </Container>
    );
  }

  const detailItem = (icon: React.ElementType, label: string, value?: string | number, isLink: boolean = false, href?: string) => (
    value ? (
      <Flex align="center" mb={3}>
        <Icon as={icon} mr={3} color={primaryColor} w={5} h={5} />
        <Text fontWeight="medium" color={textColor} minW="120px">{label}:</Text>
        {isLink && href ? (
          <NextLink href={href} passHref legacyBehavior>
            <Link color={primaryColor} _hover={{ textDecoration: 'underline' }}>{value}</Link>
          </NextLink>
        ) : (
          <Text color={subtleTextColor}>{value}</Text>
        )}
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

  return (
    <>
      <Head>
        <title>{contact.name} | Contacts | ClientFlow CRM</title>
      </Head>
      <Container maxW="container.xl" py={8} bg={bgColor}>
        <Breadcrumb spacing="8px" separator={<Icon as={FiChevronRight} color="gray.500" />} mb={6}>
          <BreadcrumbItem>
            <NextLink href="/dashboard" passHref legacyBehavior><BreadcrumbLink>Dashboard</BreadcrumbLink></NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <NextLink href="/contacts" passHref legacyBehavior><BreadcrumbLink>Contacts</BreadcrumbLink></NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href={`/contacts/${contact.id}`}>{contact.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Flex mb={6} align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
          <HStack spacing={4}>
            <Avatar size="lg" name={contact.name} src={contact.avatarUrl} bg={`${primaryColor}.100`} color={primaryColor} />
            <VStack align={{ base: 'center', md: 'flex-start' }} spacing={0}>
              <Heading as="h1" size="xl" color={textColor}>{contact.name}</Heading>
              <Text fontSize="lg" color={subtleTextColor}>{contact.jobTitle} at {contact.accountName}</Text>
            </VStack>
          </HStack>
          <Spacer />
          <Button leftIcon={<FiEdit />} colorScheme="yellow" variant="outline" shadow="sm" _hover={{ shadow: 'md' }}>
            Edit Contact
          </Button>
        </Flex>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          {/* Left Column: Details & Tabs */}
          <GridItem>
            <Card bg={cardBgColor} shadow="lg" borderRadius="xl" mb={6}>
              <CardHeader borderBottomWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                <Flex align="center">
                  <Icon as={FiInfo} w={6} h={6} color={primaryColor} mr={3} />
                  <Heading size="md" color={textColor}>Contact Information</Heading>
                </Flex>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {detailItem(FiUser, 'Full Name', contact.name)}
                  {detailItem(FiMail, 'Email', contact.email, true, `mailto:${contact.email}`)}
                  {detailItem(FiPhone, 'Phone', contact.phone, true, `tel:${contact.phone}`)}
                  {detailItem(FiBriefcase, 'Job Title', contact.jobTitle)}
                  {detailItem(FiBuilding, 'Department', contact.department)}
                  {detailItem(FiBuilding, 'Account', contact.accountName, true, `/accounts/${contact.accountId}`)}
                  {detailItem(FiLink, 'LinkedIn', contact.linkedinProfile, true, contact.linkedinProfile)}
                  {detailItem(FiInfo, 'Address', contact.address)}
                  {detailItem(FiCalendar, 'Created At', new Date(contact.createdAt).toLocaleString())}
                  {detailItem(FiCalendar, 'Last Updated', new Date(contact.updatedAt).toLocaleString())}
                </SimpleGrid>
                {contact.notes && (
                  <Box mt={4} pt={4} borderTopWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                    <Heading size="sm" color={textColor} mb={2}>Notes</Heading>
                    <Text color={subtleTextColor} whiteSpace="pre-wrap">{contact.notes}</Text>
                  </Box>
                )}
              </CardBody>
            </Card>

            <Card bg={cardBgColor} shadow="lg" borderRadius="xl">
              <Tabs colorScheme="blue" variant="enclosed-colored">
                <TabList>
                  <Tab _selected={{ bg: primaryColor, color: 'white' }}><Icon as={FiActivity} mr={2}/>Activities</Tab>
                  <Tab _selected={{ bg: primaryColor, color: 'white' }}><Icon as={FiCheckCircle} mr={2}/>Tasks</Tab>
                  <Tab _selected={{ bg: primaryColor, color: 'white' }}><Icon as={FiFileText} mr={2}/>Related (Opportunities, etc.)</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      {activities.length > 0 ? activities.map(act => (
                        <Box key={act.id} p={3} borderWidth="1px" borderRadius="md" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                          <Flex align="center" mb={1}>
                            <Icon as={activityIcon(act.type)} color={primaryColor} mr={2} />
                            <Text fontWeight="bold" color={textColor}>{act.type}</Text>
                          </Flex>
                          <Text fontSize="sm" color={textColor}>{act.summary}</Text>
                          <Text fontSize="xs" color={subtleTextColor}>By {act.user} on {new Date(act.date).toLocaleDateString()}</Text>
                        </Box>
                      )) : <Text color={subtleTextColor}>No activities logged yet.</Text>}
                      <Button mt={2} size="sm" variant="outline" colorScheme="blue">Log Activity</Button>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                     <VStack spacing={4} align="stretch">
                      {tasks.length > 0 ? tasks.map(task => (
                        <Box key={task.id} p={3} borderWidth="1px" borderRadius="md" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                          <Text fontWeight="bold" color={textColor}>{task.title}</Text>
                          <Text fontSize="sm" color={subtleTextColor}>Due: {new Date(task.dueDate).toLocaleDateString()} - Status: <Tag size="sm" colorScheme={task.status === 'Pending' ? 'yellow' : 'green'}>{task.status}</Tag></Text>
                        </Box>
                      )) : <Text color={subtleTextColor}>No tasks associated with this contact.</Text>}
                      <Button mt={2} size="sm" variant="outline" colorScheme="blue">Add Task</Button>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <Text color={subtleTextColor}>Related items (e.g., Opportunities, Cases) functionality coming soon.</Text>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Card>
          </GridItem>

          {/* Right Column: Quick Actions / Related Info (Placeholder) */}
          <GridItem>
            <Card bg={cardBgColor} shadow="lg" borderRadius="xl">
              <CardHeader borderBottomWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                <Flex align="center">
                  <Icon as={FiMessageSquare} w={6} h={6} color={primaryColor} mr={3} />
                  <Heading size="md" color={textColor}>Quick Actions</Heading>
                </Flex>
              </CardHeader>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  <Button colorScheme="blue">Send Email</Button>
                  <Button colorScheme="green" variant="outline">Create Opportunity</Button>
                  <Button colorScheme="purple" variant="outline">Add to Campaign (TBD)</Button>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

      </Container>
    </>
  );
};

export default ContactDetailPage;
