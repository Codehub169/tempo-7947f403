import React from 'react';
import { 
  Box, Heading, Text, Tag, Icon, Avatar, SimpleGrid, Button, Link as ChakraLink, 
  VStack, HStack, useColorModeValue, Tooltip, Divider, Flex, Spacer
} from '@chakra-ui/react';
import { FiTarget, FiDollarSign, FiCalendar, FiPercent, FiUser, FiBriefcase, FiEdit3, FiInfo, FiFileText, FiTrendingUp, FiExternalLink } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import NextLink from 'next/link';
import { OpportunityFormData } from './OpportunityForm'; // Assuming this is where the base data structure is

// More detailed interface for display, potentially including resolved names for IDs
export interface OpportunityDetails extends OpportunityFormData {
  accountName?: string;
  ownerName?: string;
  ownerAvatarUrl?: string;
  createdAt?: string; // ISO Date string
  updatedAt?: string; // ISO Date string
}

interface OpportunityDetailCardProps {
  opportunity: OpportunityDetails;
  onEdit?: (opportunityId: string) => void;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | number | React.ReactNode; isLink?: boolean; href?: string; isCurrency?: boolean }> = ({ icon, label, value, isLink, href, isCurrency }) => {
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const labelColor = useColorModeValue('gray.500', 'gray.400');

  let displayValue = value;
  if (isCurrency && typeof value === 'number') {
    displayValue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);
  }
  if (typeof value === 'string' && (label === 'Description' || label === 'Next Steps')) {
    displayValue = <Text whiteSpace="pre-wrap">{value}</Text>;
  }

  return (
    <Box>
      <HStack spacing={2} align="center">
        <Icon as={icon} color={labelColor} boxSize={4} />
        <Text fontSize="sm" color={labelColor} fontWeight="medium">{label}</Text>
      </HStack>
      {isLink && href ? (
        <ChakraLink as={NextLink} href={href} passHref color="crm-primary.500" _hover={{ textDecoration: 'underline' }} fontSize="md" fontWeight="medium">
          {displayValue || 'N/A'}
        </ChakraLink>
      ) : (
        <Text fontSize="md" fontWeight="medium" color={textColor} mt={1}>{displayValue || 'N/A'}</Text>
      )}
    </Box>
  );
};

const getStageTagColorScheme = (stage: OpportunityFormData['stage']) => {
  switch (stage) {
    case 'Prospecting': return 'gray';
    case 'Qualification': return 'blue';
    case 'Proposal': return 'purple';
    case 'Negotiation': return 'orange';
    case 'Closed Won': return 'green';
    case 'Closed Lost': return 'red';
    default: return 'gray';
  }
};

export const OpportunityDetailCard: React.FC<OpportunityDetailCardProps> = ({ opportunity, onEdit }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={cardBg} p={{ base: 6, md: 8 }} borderRadius="xl" shadow="xl" borderWidth="1px" borderColor={borderColor}>
      <VStack spacing={6} align="stretch">
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'flex-start', md: 'center' }} justify="space-between">
          <HStack spacing={4} align="center" mb={{ base: 4, md: 0 }}>
            <Icon as={FiTarget} boxSize={{ base: 8, md: 10 }} color="crm-primary.500" />
            <VStack align="flex-start" spacing={0}>
              <Heading as="h2" size="lg" fontWeight="semibold" fontFamily="Poppins" color={useColorModeValue('gray.700', 'gray.100')}>
                {opportunity.opportunityName}
              </Heading>
              {opportunity.accountName && (
                <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.300')}>
                  For: 
                  <NextLink href={`/accounts/${opportunity.accountId}`} passHref>
                    <ChakraLink color="crm-primary.500" fontWeight="medium" _hover={{ textDecoration: 'underline' }}> {opportunity.accountName}</ChakraLink>
                  </NextLink>
                </Text>
              )}
            </VStack>
          </HStack>
          {onEdit && (
            <Button 
              leftIcon={<FiEdit3 />} 
              colorScheme="crm-primary" 
              variant="outline"
              onClick={() => onEdit(opportunity.id!)}
              size="sm"
              _hover={{ bg: useColorModeValue('crm-primary.50', 'crm-primary.700'), color: useColorModeValue('crm-primary.600', 'white')}}
            >
              Edit Opportunity
            </Button>
          )}
        </Flex>

        <Tag 
          size="lg" 
          variant="subtle" 
          colorScheme={getStageTagColorScheme(opportunity.stage)}
          borderRadius="full"
          px={4}
          py={2}
          alignSelf="flex-start"
        >
          <Icon as={FiTrendingUp} mr={2} />
          {opportunity.stage}
        </Tag>
        
        <Divider my={2} />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={4}>
          <DetailItem icon={FiDollarSign} label="Amount" value={opportunity.amount} isCurrency />
          <DetailItem icon={FiCalendar} label="Close Date" value={opportunity.closeDate ? format(parseISO(opportunity.closeDate), 'PPP') : 'N/A'} />
          <DetailItem icon={FiPercent} label="Probability" value={opportunity.probability !== undefined ? `${opportunity.probability}%` : 'N/A'} />
          {opportunity.accountName && <DetailItem icon={FiBriefcase} label="Account" value={opportunity.accountName} isLink href={`/accounts/${opportunity.accountId}`} />}
          {opportunity.ownerName && (
            <HStack spacing={2} align="center">
              <Icon as={FiUser} color={useColorModeValue('gray.500', 'gray.400')} boxSize={4} />
              <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} fontWeight="medium">Owner</Text>
              <Avatar src={opportunity.ownerAvatarUrl} name={opportunity.ownerName} size="xs" ml={1}/>
              <Text fontSize="md" fontWeight="medium" color={useColorModeValue('gray.700', 'gray.300')}>{opportunity.ownerName}</Text>
            </HStack>
          )}
          <DetailItem icon={FiInfo} label="Lead Source" value={opportunity.leadSource} />
        </SimpleGrid>

        {opportunity.description && (
          <>
            <Divider my={2} />
            <DetailItem icon={FiFileText} label="Description" value={opportunity.description} />
          </>
        )}

        <Divider my={4} />
        <HStack justify="space-between" color={useColorModeValue('gray.500', 'gray.400')} fontSize="sm">
          <Text>Created: {opportunity.createdAt ? format(parseISO(opportunity.createdAt), 'PPpp') : 'N/A'}</Text>
          <Text>Last Updated: {opportunity.updatedAt ? format(parseISO(opportunity.updatedAt), 'PPpp') : 'N/A'}</Text>
        </HStack>

      </VStack>
    </Box>
  );
};
