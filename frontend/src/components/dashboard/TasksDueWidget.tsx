import React from 'react';
import { Box, Heading, VStack, Text, Icon, Flex, Tag, useColorModeValue, Button, Divider } from '@chakra-ui/react';
import { FiList, FiChevronRight, FiCheckCircle, FiAlertOctagon, FiClock } from 'react-icons/fi';
import NextLink from 'next/link';
import { format } from 'date-fns';

export interface TaskSummary {
  id: string;
  title: string;
  dueDate: Date;
  priority: 'High' | 'Medium' | 'Low';
  relatedTo?: {
    name: string;
    type: 'Lead' | 'Contact' | 'Account' | 'Opportunity';
    id: string;
  };
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface TasksDueWidgetProps {
  tasks: TaskSummary[];
  isLoading?: boolean;
}

const getPriorityColorScheme = (priority: TaskSummary['priority']) => {
  if (priority === 'High') return 'red';
  if (priority === 'Medium') return 'orange';
  return 'green';
};

const TasksDueWidget: React.FC<TasksDueWidgetProps> = ({ tasks, isLoading }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.700', 'whiteAlpha.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const upcomingTasks = tasks
    .filter(task => task.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5); // Show top 5 upcoming tasks

  return (
    <Box bg={cardBg} p={6} borderRadius="xl" shadow="lg" borderWidth="1px" borderColor={borderColor}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Flex alignItems="center">
          <Icon as={FiList} w={6} h={6} color="crm-primary.500" mr={2} />
          <Heading size="md" color={headingColor} fontFamily="Poppins">
            Upcoming Tasks
          </Heading>
        </Flex>
        <NextLink href="/tasks" passHref>
          <Button as="a" size="sm" variant="link" colorScheme="crm-primary" rightIcon={<FiChevronRight />}>
            View All
          </Button>
        </NextLink>
      </Flex>
      <Divider my={2} borderColor={borderColor}/>
      {isLoading ? (
        <Text>Loading tasks...</Text>
      ) : upcomingTasks.length === 0 ? (
        <Flex direction="column" align="center" justify="center" py={8} color={textColor}>
            <Icon as={FiCheckCircle} boxSize={12} color="green.400" mb={3} />
            <Text fontSize="lg" fontWeight="medium">All caught up!</Text>
            <Text fontSize="sm">No pending tasks due soon.</Text>
        </Flex>
      ) : (
        <VStack spacing={4} align="stretch">
          {upcomingTasks.map((task) => (
            <NextLink key={task.id} href={`/tasks/${task.id}`} passHref>
              <Box 
                as="a" 
                p={3} 
                borderWidth="1px" 
                borderColor={borderColor} 
                borderRadius="md" 
                _hover={{ shadow: 'md', borderColor: 'crm-primary.300' }}
                transition="all 0.2s ease-in-out"
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontWeight="medium" color={headingColor} noOfLines={1}>{task.title}</Text>
                  <Tag size="sm" colorScheme={getPriorityColorScheme(task.priority)}>
                    {task.priority}
                  </Tag>
                </Flex>
                <Flex alignItems="center" mt={1.5}>
                    <Icon as={FiClock} mr={1.5} color={textColor} boxSize={3.5}/>
                    <Text fontSize="xs" color={textColor}>
                        Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </Text>
                </Flex>
                {task.relatedTo && (
                  <Text fontSize="xs" color={textColor} mt={1}>
                    Related to: <Text as="span" fontWeight="bold">{task.relatedTo.name}</Text> ({task.relatedTo.type})
                  </Text>
                )}
              </Box>
            </NextLink>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default TasksDueWidget;
