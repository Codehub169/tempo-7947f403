import React from 'react';
import {
  Box, VStack, HStack, Text, Icon, Avatar, useColorModeValue, Heading, Flex, Tooltip, Link
} from '@chakra-ui/react';
import {
  FiPhone, FiMessageSquare, FiBriefcase, FiType, FiCalendar, FiUser, FiEdit2, FiPaperclip, FiCheckSquare
} from 'react-icons/fi'; // FiEdit2 for Note, FiPaperclip for generic, FiCheckSquare for TaskCreated
import { format, formatDistanceToNowStrict, parseISO } from 'date-fns';
import NextLink from 'next/link';

export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'Note' | 'TaskCreated' | 'LeadCreated' | 'OpportunityUpdated'; // Expanded types

export interface Activity {
  id: string;
  type: ActivityType;
  summary: string;
  notes?: string;
  date: string | Date; // ISO string or Date object
  user?: { id: string; name: string; avatarUrl?: string };
  target?: { id: string; name: string; type: string }; // e.g. target a specific lead, contact
}

interface ActivityTimelineProps {
  activities: Activity[];
  isLoading?: boolean;
  title?: string;
}

const ActivityIcon: React.FC<{ type: ActivityType }> = ({ type }) => {
  const iconMap: Record<ActivityType, React.ElementType> = {
    Call: FiPhone,
    Email: FiMessageSquare,
    Meeting: FiBriefcase,
    Note: FiEdit2,
    TaskCreated: FiCheckSquare,
    LeadCreated: FiUser, // Placeholder, could be specific lead icon
    OpportunityUpdated: FiPaperclip, // Placeholder, could be specific opportunity icon
  };
  const IconComponent = iconMap[type] || FiPaperclip;
  return <Icon as={IconComponent} fontSize="xl" />_PRIMARY
};

const ActivityTimelineItem: React.FC<{ activity: Activity; isLast: boolean }> = ({ activity, isLast }) => {
  const itemBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const subtleTextColor = useColorModeValue('gray.500', 'gray.400');
  const primaryColor = useColorModeValue('crm-primary.500', 'crm-primary.300');

  const activityDate = typeof activity.date === 'string' ? parseISO(activity.date) : activity.date;

  return (
    <HStack spacing={4} align="start" w="full">
      <Flex direction="column" align="center" pos="relative">
        <Box 
          p={2} 
          bg={primaryColor} 
          color="white" 
          borderRadius="full" 
          zIndex={1}
          boxShadow="md"
        >
          <ActivityIcon type={activity.type} />
        </Box>
        {!isLast && (
          <Box 
            w="2px" 
            flexGrow={1} 
            bg={borderColor} 
            my={1} 
            minH="40px"
          />
        )}
      </Flex>

      <Box bg={itemBg} p={4} borderRadius="lg" flex={1} borderWidth="1px" borderColor={borderColor} shadow="sm">
        <Flex justifyContent="space-between" alignItems="center" mb={1}>
          <Text fontWeight="bold" fontFamily="Poppins" color={textColor} fontSize="md">
            {activity.summary}
          </Text>
          <Tooltip label={format(activityDate, 'PPPp')} openDelay={300}>
            <Text fontSize="xs" color={subtleTextColor}>
              {formatDistanceToNowStrict(activityDate, { addSuffix: true })}
            </Text>
          </Tooltip>
        </Flex>

        {activity.user && (
          <Flex alignItems="center" mb={2}>
            <Avatar size="xs" name={activity.user.name} src={activity.user.avatarUrl} mr={2} />
            <Text fontSize="sm" color={subtleTextColor}>
              Logged by {activity.user.name}
            </Text>
          </Flex>
        )}

        {activity.notes && (
          <Text fontSize="sm" color={textColor} whiteSpace="pre-wrap" mt={2} p={2} bg={useColorModeValue('blackAlpha.50', 'whiteAlpha.50')} borderRadius="md">
            {activity.notes}
          </Text>
        )}

        {activity.target && (
          <Text fontSize="xs" color={subtleTextColor} mt={2}>
            Related to: <NextLink href={`/${activity.target.type.toLowerCase()}s/${activity.target.id}`} passHref legacyBehavior><Link color={primaryColor} fontWeight="medium">{activity.target.name} ({activity.target.type})</Link></NextLink>
          </Text>
        )}
      </Box>
    </HStack>
  );
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, isLoading, title = "Recent Activities" }) => {
  const containerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (isLoading) {
    return <Box p={5} textAlign="center">Loading activities...</Box>;
  }

  if (!activities || activities.length === 0) {
    return (
      <Box p={6} bg={containerBg} borderRadius="xl" shadow="lg" borderWidth="1px" borderColor={borderColor} textAlign="center">
        <Icon as={FiCalendar} boxSize={12} color="gray.400" mb={4} />
        <Heading as="h4" size="md" fontFamily="Poppins" mb={2}>No Activities Yet</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')}>There are no activities to display at this moment.</Text>
      </Box>
    );
  }

  return (
    <Box bg={containerBg} p={6} borderRadius="xl" shadow="lg" borderWidth="1px" borderColor={borderColor}>
      <Heading as="h3" size="lg" mb={6} fontFamily="Poppins" display="flex" alignItems="center">
        <Icon as={FiCalendar} mr={3} color="crm-primary.500" /> {title}
      </Heading>
      <VStack spacing={6} align="stretch">
        {activities.map((activity, index) => (
          <ActivityTimelineItem key={activity.id} activity={activity} isLast={index === activities.length - 1} />
        ))}
      </VStack>
    </Box>
  );
};

export default ActivityTimeline;
