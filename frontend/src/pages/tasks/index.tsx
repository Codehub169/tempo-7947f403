import { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState, useMemo } from 'react';
import NextLink from 'next/link';
import { 
  Container, 
  Heading, 
  Text, 
  Spinner, 
  Box, 
  Flex, 
  Button, 
  Icon, 
  InputGroup, 
  InputLeftElement, 
  Input, 
  Select, 
  Stack, 
  TableContainer, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Tag, 
  IconButton, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  useColorModeValue,
  HStack,
  Badge
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiFilter, FiList, FiChevronDown, FiEdit2, FiCheckSquare, FiTrash2, FiAlertCircle, FiCalendar, FiTag, FiUser, FiLink2 } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { Layout } from '@/components/common/Layout';

// Mock data - replace with API calls
interface Task {
  id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string; // ISO string
  assignedTo?: string;
  relatedToType?: 'Lead' | 'Opportunity' | 'Account' | 'Contact';
  relatedToName?: string;
  relatedToId?: string;
  createdAt: string;
}

const mockTasks: Task[] = [
  { id: 'task001', title: 'Follow up with Alpha Corp proposal', status: 'Pending', priority: 'High', dueDate: '2024-07-25', assignedTo: 'Sarah Miller', relatedToType: 'Opportunity', relatedToName: 'Alpha Corp Software Deal', relatedToId: 'opp123', createdAt: '2024-07-20T10:00:00Z' },
  { id: 'task002', title: 'Prepare demo for Beta Ltd', status: 'In Progress', priority: 'Medium', dueDate: '2024-07-28', assignedTo: 'John Doe', relatedToType: 'Lead', relatedToName: 'Beta Ltd Inquiry', relatedToId: 'lead456', createdAt: '2024-07-18T14:30:00Z' },
  { id: 'task003', title: 'Send onboarding materials to Gamma Inc', status: 'Completed', priority: 'Low', dueDate: '2024-07-15', assignedTo: 'Sarah Miller', relatedToType: 'Account', relatedToName: 'Gamma Inc', relatedToId: 'acc789', createdAt: '2024-07-10T09:00:00Z' },
  { id: 'task004', title: 'Schedule Q3 review meeting', status: 'Pending', priority: 'Medium', dueDate: '2024-08-05', assignedTo: 'Admin', createdAt: '2024-07-22T11:00:00Z' },
  { id: 'task005', title: 'Update contact details for Mr. Sharma', status: 'In Progress', priority: 'Low', dueDate: '2024-07-26', assignedTo: 'John Doe', relatedToType: 'Contact', relatedToName: 'Anil Sharma', relatedToId: 'con012', createdAt: '2024-07-21T16:00:00Z' },
];

const getStatusColorScheme = (status: Task['status']) => {
  if (status === 'Completed') return 'green';
  if (status === 'In Progress') return 'yellow';
  return 'gray';
};

const getPriorityColorScheme = (priority: Task['priority']) => {
  if (priority === 'High') return 'red';
  if (priority === 'Medium') return 'orange';
  return 'blue';
};

const TasksPage: NextPage & { getLayout?: (page: ReactElement) => ReactElement } = () => {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

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
    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks);
      setIsLoading(false);
    }, 1000);
  }, [session, authStatus, router]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.relatedToName && task.relatedToName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(task => (statusFilter ? task.status === statusFilter : true))
      .filter(task => (priorityFilter ? task.priority === priorityFilter : true))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); // Sort by due date
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  if (isLoading || authStatus === 'loading') {
    return (
      <Flex justify="center" align="center" minH="calc(100vh - 120px)">
        <Spinner size="xl" color="crm-primary.500" />
      </Flex>
    );
  }

  return (
    <>
      <Head>
        <title>Task Management | ClientFlow CRM</title>
        <meta name="description" content="Manage and track all your sales tasks and activities." />
      </Head>

      <Container maxW="container.xl" py={8} px={{ base: 4, md: 8 }}>
        <Flex justify="space-between" align="center" mb={8} direction={{ base: 'column', md: 'row' }} gap={4}>
          <Flex align="center">
            <Icon as={FiList} color="crm-primary.500" boxSize={8} mr={3} />
            <Heading as="h1" size="xl" fontWeight="bold" color={textColor}>
              Task Management
            </Heading>
          </Flex>
          <NextLink href="/tasks/new" passHref> {/* Assuming a /tasks/new page for creating tasks */}
            <Button as="a" leftIcon={<FiPlus />} colorScheme="crm-primary" size="md" shadow="md" _hover={{ shadow: 'lg' }}>
              Add New Task
            </Button>
          </NextLink>
        </Flex>

        <Card bg={cardBg} shadow="xl" borderRadius="lg" borderColor={borderColor} borderWidth={1}>
          <Box p={6}>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={6}>
              <InputGroup flex={1}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="Search tasks by title or related entity..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  _hover={{ borderColor: 'crm-primary.300' }}
                  _focus={{ borderColor: 'crm-primary.500', boxShadow: `0 0 0 1px var(--chakra-colors-crm-primary-500)` }}
                />
              </InputGroup>
              <Select 
                placeholder="All Statuses" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                icon={<FiFilter />} 
                minW="180px"
                bg={useColorModeValue('gray.50', 'gray.800')}
                _hover={{ borderColor: 'crm-primary.300' }}
                _focus={{ borderColor: 'crm-primary.500', boxShadow: `0 0 0 1px var(--chakra-colors-crm-primary-500)` }}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>
              <Select 
                placeholder="All Priorities" 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)} 
                icon={<FiTag />} 
                minW="180px"
                bg={useColorModeValue('gray.50', 'gray.800')}
                _hover={{ borderColor: 'crm-primary.300' }}
                _focus={{ borderColor: 'crm-primary.500', boxShadow: `0 0 0 1px var(--chakra-colors-crm-primary-500)` }}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </Stack>

            {filteredTasks.length > 0 ? (
              <TableContainer>
                <Table variant="simple" size="md">
                  <Thead>
                    <Tr>
                      <Th>Title</Th>
                      <Th><Icon as={FiTag} mr={1} verticalAlign="middle"/>Status</Th>
                      <Th><Icon as={FiAlertCircle} mr={1} verticalAlign="middle"/>Priority</Th>
                      <Th><Icon as={FiCalendar} mr={1} verticalAlign="middle"/>Due Date</Th>
                      <Th><Icon as={FiUser} mr={1} verticalAlign="middle"/>Assigned To</Th>
                      <Th><Icon as={FiLink2} mr={1} verticalAlign="middle"/>Related To</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredTasks.map((task) => (
                      <Tr key={task.id} _hover={{ bg: useColorModeValue('gray.100', 'gray.600'), cursor: 'pointer' }}>
                        <Td fontWeight="medium" color={textColor}>{task.title}</Td>
                        <Td>
                          <Tag size="md" variant="subtle" colorScheme={getStatusColorScheme(task.status)} borderRadius="full" px={3}>
                            {task.status}
                          </Tag>
                        </Td>
                        <Td>
                          <Tag size="sm" variant="outline" colorScheme={getPriorityColorScheme(task.priority)}>{task.priority}</Tag>
                        </Td>
                        <Td color={subtleTextColor}>{format(parseISO(task.dueDate), 'dd MMM, yyyy')}</Td>
                        <Td color={subtleTextColor}>{task.assignedTo || '-'}</Td>
                        <Td>
                          {task.relatedToName ? (
                            <NextLink href={`/${task.relatedToType?.toLowerCase()}s/${task.relatedToId}`} passHref>
                              <ChakraLink color="crm-primary.500" _hover={{ textDecoration: 'underline' }}>
                                {task.relatedToName}
                                <Badge ml={2} colorScheme='gray' fontSize='0.7em'>{task.relatedToType}</Badge>
                              </ChakraLink>
                            </NextLink>
                          ) : '-'}
                        </Td>
                        <Td>
                          <Menu>
                            <MenuButton 
                              as={IconButton} 
                              aria-label="Task Actions" 
                              icon={<FiChevronDown />} 
                              variant="ghost" 
                              size="sm"
                            />
                            <MenuList shadow="lg">
                              <MenuItem icon={<FiEdit2 size="16px"/>} isDisabled>Edit Task</MenuItem>
                              <MenuItem icon={<FiCheckSquare size="16px"/>} isDisabled={task.status === 'Completed'}>Mark as Complete</MenuItem>
                              <MenuItem icon={<FiTrash2 size="16px"/>} color="red.500" isDisabled>Delete Task</MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Flex direction="column" align="center" justify="center" py={20}>
                <Icon as={FiList} boxSize={16} color="gray.400" mb={4} />
                <Heading as="h3" size="md" color={subtleTextColor} mb={2}>No Tasks Found</Heading>
                <Text color={subtleTextColor}>Try adjusting your filters or create a new task.</Text>
              </Flex>
            )}
          </Box>
        </Card>
      </Container>
    </>
  );
};

TasksPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TasksPage;
