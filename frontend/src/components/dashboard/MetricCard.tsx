import React from 'react';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  Flex,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: IconType;
  trend?: {
    direction: 'increase' | 'decrease';
    value: string;
  };
  isLoading?: boolean;
  onClick?: () => void;
  bgColor?: string;
  iconColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  isLoading = false,
  onClick,
  bgColor,
  iconColor = 'crm-primary.500',
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const titleColor = useColorModeValue('gray.500', 'gray.400');
  const valueColor = useColorModeValue('gray.800', 'white');
  const defaultIconBg = useColorModeValue('crm-primary.50', 'crm-primary.800');

  return (
    <Box
      bg={bgColor || cardBg}
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      transition="all 0.2s ease-in-out"
      _hover={onClick ? { transform: 'translateY(-4px)', shadow: 'xl', cursor: 'pointer' } : {}}
      onClick={onClick}
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" h="100px">
          <Spinner size="lg" color="crm-primary.500" />
        </Flex>
      ) : (
        <Flex alignItems="center" justifyContent="space-between">
          <Stat>
            <StatLabel 
              fontSize="md" 
              fontWeight="medium" 
              color={titleColor} 
              fontFamily="Poppins, sans-serif"
              mb={1}
            >
              {title}
            </StatLabel>
            <StatNumber 
              fontSize="3xl" 
              fontWeight="bold" 
              color={valueColor} 
              fontFamily="Inter, sans-serif"
            >
              {value}
            </StatNumber>
            {trend && (
              <StatHelpText fontSize="sm" mt={1}>
                <StatArrow type={trend.direction === 'increase' ? 'increase' : 'decrease'} />
                {trend.value}
              </StatHelpText>
            )}
          </Stat>
          {icon && (
            <Flex 
              alignItems="center" 
              justifyContent="center" 
              w={14} 
              h={14} 
              borderRadius="full" 
              bg={defaultIconBg}
              ml={4}
            >
              <Icon as={icon} w={7} h={7} color={iconColor} />
            </Flex>
          )}
        </Flex>
      )}
    </Box>
  );
};

export default MetricCard;
