import React from 'react';
import {
  Box, Flex, Text, Tag, IconButton, Menu, MenuButton, MenuList, MenuItem, Icon, useColorModeValue, Tooltip, Link
} from '@chakra-ui/react';
import { FiClock, FiEdit3, FiEye, FiCheckCircle, FiTrash2, FiMoreVertical, FiLink, FiUser, FiBriefcase, FiTarget, FiList } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import NextLink from 'next/link';

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
export type RelatedEntityType = 'Lead' | 'Contact' | 'Account' | 'Opportunity' | 'None';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | Date;
  assignedTo?: { id: string; name: string };
  relatedToType?: RelatedEntityType;
  relatedToId?: string;
  relatedToName?: string;
  description?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface TaskListItemProps {
  task: Task;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onMarkComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getPriorityColorScheme = (priority: TaskPriority) => {
  switch (priority) {
    case 'High': return 'red';
    case 'Medium': return 'orange';
    case 'Low': return 'blue';
    default: return 'gray';
  }
};

const getStatusColorScheme = (status: TaskStatus) => {
  switch (status) {
    case 'Completed': return 'green';
    case 'In Progress': return 'yellow';
    case 'Pending': return 'blue';
    case 'Cancelled': return 'gray';
    default: return 'gray';
  }
};

const RelatedEntityIcon: React.FC<{ type?: RelatedEntityType }> = ({ type }) => {
  switch (type) {
    case 'Lead': return <Icon as={FiUser} mr={1} />;
    case 'Contact': return <Icon as={FiUser} mr={1} />;
    case 'Account': return <Icon as={FiBriefcase} mr={1} />;
    case 'Opportunity': return <Icon as={FiTarget} mr={1} />;
    default: return <Icon as={FiList} mr={1} />;
  }
};

const TaskListItem: React.FC<TaskListItemProps> = ({ task, onViewDetails, onEdit, onMarkComplete, onDelete }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const subtleTextColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const relatedEntityPath = () => {
    if (!task.relatedToType || !task.relatedToId || task.relatedToType === 'None') return '#';
    const typePath = task.relatedToType.toLowerCase() + 's'; // e.g. leads, contacts
    return `/${typePath}/${task.relatedToId}`;
  };

  return (
    <Flex
      p={4}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      alignItems="center"
      justifyContent="space-between"
      _hover={{ bg: hoverBg, shadow: 'md', transform: 'translateY(-2px)', transition: 'all 0.2s ease-out' }}
      transition="all 0.2s ease-in-out"
      mb={3}
    >
      <Box flex={1} mr={4} overflow="hidden">
        <Tooltip label={task.title} placement="top-start" openDelay={500}>
          <Text fontWeight="medium" color={textColor} fontSize="md" noOfLines={1} fontFamily="Poppins">
            {task.title}
          </Text>
        </Tooltip>
        {task.relatedToName && task.relatedToType !== 'None' && (
          <NextLink href={relatedEntityPath()} passHref legacyBehavior>
            <Link fontSize="sm" color="crm-primary.500" _hover={{ textDecoration: 'underline' }} display="flex" alignItems="center">
              <RelatedEntityIcon type={task.relatedToType} />
              {task.relatedToName}
            </Link>
          </NextLink>
        )}
      </Box>

      <Flex alignItems="center" gap={{ base: 2, md: 3 }} flexWrap="nowrap">
        <Tooltip label={`Status: ${task.status}`}>
          <Tag size="sm" colorScheme={getStatusColorScheme(task.status)} variant="subtle">
            {task.status}
          </Tag>
        </Tooltip>

        <Tooltip label={`Priority: ${task.priority}`}>
          <Tag size="sm" colorScheme={getPriorityColorScheme(task.priority)} variant="solid">
            {task.priority}
          </Tag>
        </Tooltip>

        {task.dueDate && (
          <Tooltip label={`Due: ${format(parseISO(task.dueDate.toString()), 'PP')}`}>
            <Flex alignItems="center" color={subtleTextColor} fontSize="sm">
              <Icon as={FiClock} mr={1} />
              {format(parseISO(task.dueDate.toString()), 'MMM d')}
            </Flex>
          </Tooltip>
        )}

        {task.assignedTo && (
          <Tooltip label={`Assigned to: ${task.assignedTo.name}`}>
            <Text fontSize="sm" color={subtleTextColor} display={{ base: 'none', md: 'block' }} noOfLines={1}>
              {task.assignedTo.name}
            </Text>
          </Tooltip>
        )}
      </Flex>

      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FiMoreVertical />}
          variant="ghost"
          size="sm"
          aria-label="Task actions"
          ml={3}
        />
        <MenuList shadow="xl" borderColor={borderColor}>
          {onViewDetails && (
            <MenuItem icon={<FiEye />} onClick={() => onViewDetails(task.id)}>
              View Details
            </MenuItem>
          )}
          {onEdit && (
            <MenuItem icon={<FiEdit3 />} onClick={() => onEdit(task.id)}>
              Edit Task
            </MenuItem>
          )}
          {onMarkComplete && task.status !== 'Completed' && (
            <MenuItem icon={<FiCheckCircle />} onClick={() => onMarkComplete(task.id)}>
              Mark as Complete
            </MenuItem>
          )}
          {onDelete && (
            <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => onDelete(task.id)}>
              Delete Task
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default TaskListItem;
