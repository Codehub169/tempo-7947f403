import React from 'react';
import { Box, Flex, Text, Icon, useColorModeValue, Avatar } from '@chakra-ui/react';
import { FiMessageSquare, FiPhoneCall, FiMail, FiCheckCircle, FiUserPlus, FiBriefcase, FiTrendingUp, FiDollarSign, FiEdit3 } from 'react-icons/fi';
import { formatDistanceToNowStrict } from 'date-fns';

export interface Activity {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'task_completed' | 'lead_created' | 'contact_created' | 'account_created' | 'opportunity_created' | 'deal_won' | 'deal_lost' | 'field_update';
  user: {
    name: string;
    avatarUrl?: string;
  };
  timestamp: Date;
  summary: string;
  target?: {
    name: string;
    type: 'lead' | 'contact' | 'account' | 'opportunity';
    id: string;
  };
}

interface RecentActivityItemProps {
  activity: Activity;
}

const activityIcons: Record<Activity['type'], { icon: React.ElementType; color: string }> = {
  note: { icon: FiMessageSquare, color: 'gray.500' },
  call: { icon: FiPhoneCall, color: 'blue.500' },
  email: { icon: FiMail, color: 'teal.500' },
  meeting: { icon: FiBriefcase, color: 'purple.500' },
  task_completed: { icon: FiCheckCircle, color: 'green.500' },
  lead_created: { icon: FiUserPlus, color: 'crm-accent.500' },
  contact_created: { icon: FiUserPlus, color: 'cyan.500' },
  account_created: { icon: FiBriefcase, color: 'orange.500' },
  opportunity_created: { icon: FiTrendingUp, color: 'yellow.500' },
  deal_won: { icon: FiDollarSign, color: 'green.500' },
  deal_lost: { icon: FiDollarSign, color: 'red.500' },
  field_update: { icon: FiEdit3, color: 'indigo.500' },
};

const RecentActivityItem: React.FC<RecentActivityItemProps> = ({ activity }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  const { icon: ActivityIcon, color: iconColor } = activityIcons[activity.type] || activityIcons.note;

  return (
    <Flex
      alignItems="flex-start"
      p={4}
      bg={cardBg}
      _hover={{ bg: hoverBg, cursor: 'pointer', shadow: 'md' }}
      transition="all 0.2s ease-in-out"
      borderBottomWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      _last={{ borderBottomWidth: 0 }}
    >
      <Flex 
        alignItems="center" 
        justifyContent="center" 
        bg={iconColor} 
        color="white" 
        borderRadius="full" 
        w={8} h={8} 
        mr={3}
        flexShrink={0}
      >
        <Icon as={ActivityIcon} boxSize={4} />
      </Flex>
      <Box flex={1}>
        <Text fontWeight="medium" color={useColorModeValue('gray.800', 'whiteAlpha.900')} fontSize="sm">
          {activity.summary}
          {activity.target && (
            <Text as="span" color={textColor} ml={1}>
              on <Text as="span" fontWeight="bold" color={useColorModeValue('crm-primary.500', 'crm-primary.300')}>{activity.target.name}</Text>
            </Text>
          )}
        </Text>
        <Flex alignItems="center" mt={1}>
          {activity.user.avatarUrl ? (
            <Avatar size="xs" name={activity.user.name} src={activity.user.avatarUrl} mr={2} />
          ) : (
            <Icon as={FiUserPlus} boxSize={3} color={textColor} mr={2} />
          )}
          <Text fontSize="xs" color={textColor}>
            {activity.user.name} • {formatDistanceToNowStrict(new Date(activity.timestamp), { addSuffix: true })}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default RecentActivityItem;
