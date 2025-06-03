import React from 'react';
import {
  Box, Heading, Text, Tag, Icon, Avatar, VStack, HStack, SimpleGrid,
  useColorModeValue, Tooltip, Link as ChakraLink, Flex, ScrollArea
} from '@chakra-ui/react';
import { FiTarget, FiDollarSign, FiCalendar, FiUser, FiChevronsRight, FiAlertCircle } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import NextLink from 'next/link';
import { OpportunityDetails } from './OpportunityDetailCard'; // Reusing the detailed interface

// Define the stages for the pipeline explicitly
const PIPELINE_STAGES: OpportunityDetails['stage'][] = [
  'Prospecting',
  'Qualification',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
];

interface PipelineViewProps {
  opportunities: OpportunityDetails[];
  isLoading?: boolean;
  // onOpportunityMove?: (opportunityId: string, newStage: OpportunityDetails['stage']) => void; // For future drag-and-drop
}

const OpportunityCard: React.FC<{ opportunity: OpportunityDetails }> = ({ opportunity }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  const stageColorSchemes: Record<OpportunityDetails['stage'], string> = {
    Prospecting: 'gray',
    Qualification: 'blue',
    Proposal: 'purple',
    Negotiation: 'orange',
    'Closed Won': 'green',
    'Closed Lost': 'red',
  };

  return (
    <NextLink href={`/opportunities/${opportunity.id}`} passHref>
      <Box 
        as="a"
        p={4}
        bg={cardBg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        shadow="md"
        _hover={{ shadow: 'lg', bg: hoverBg, transform: 'translateY(-2px)' }}
        transition="all 0.2s ease-in-out"
        display="block"
        mb={4}
      >
        <VStack align="stretch" spacing={2}>
          <Heading as="h4" size="sm" fontWeight="medium" fontFamily="Poppins" noOfLines={2}>
            {opportunity.opportunityName}
          </Heading>
          <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
            {opportunity.accountName || 'N/A Account'}
          </Text>
          <HStack justifyContent="space-between" alignItems="center">
            <Tag size="sm" colorScheme={stageColorSchemes[opportunity.stage]} variant="solid" borderRadius="full">
              {opportunity.stage}
            </Tag>
            <Text fontSize="sm" fontWeight="bold" color={`crm-primary.500`}>
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(opportunity.amount)}
            </Text>
          </HStack>
          <HStack fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} mt={1}>
            <Icon as={FiCalendar} />
            <Text>Close: {opportunity.closeDate ? format(parseISO(opportunity.closeDate), 'MMM d, yyyy') : 'N/A'}</Text>
          </HStack>
          {opportunity.ownerName && (
            <HStack fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>
              <Icon as={FiUser} />
              <Text noOfLines={1}>{opportunity.ownerName}</Text>
            </HStack>
          )}
        </VStack>
      </Box>
    </NextLink>
  );
};

export const PipelineView: React.FC<PipelineViewProps> = ({ opportunities, isLoading }) => {
  const stageContainerBg = useColorModeValue('gray.100', 'gray.900');
  const stageHeaderBg = useColorModeValue('gray.200', 'gray.700');

  const opportunitiesByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = opportunities.filter(op => op.stage === stage);
    return acc;
  }, {} as Record<OpportunityDetails['stage'], OpportunityDetails[]>);

  if (isLoading) {
    return <Text>Loading pipeline...</Text>; // Replace with a proper Skeleton loader
  }

  if (!opportunities || opportunities.length === 0 && !isLoading) {
    return (
      <Flex direction="column" align="center" justify="center" p={10} borderWidth="1px" borderRadius="lg" bg={useColorModeValue('white', 'gray.800')} shadow="md">
        <Icon as={FiAlertCircle} boxSize={12} color="crm-primary.400" mb={4} />
        <Heading as="h3" size="md" mb={2} fontFamily="Poppins">No Opportunities Yet</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')}>Start by adding new opportunities to see them in the pipeline.</Text>
      </Flex>
    );
  }

  return (
    <Flex overflowX="auto" py={4} >
      <HStack spacing={6} align="flex-start" minWidth={`${PIPELINE_STAGES.length * 320}px`}> {/* Ensure enough width for scrolling */} 
        {PIPELINE_STAGES.map(stage => (
          <Box 
            key={stage} 
            bg={stageContainerBg} 
            borderRadius="xl" 
            p={4} 
            minWidth="300px" 
            maxWidth="300px" 
            height="fit-content"
            shadow="base"
          >
            <HStack 
              justifyContent="space-between" 
              alignItems="center" 
              mb={4} 
              pb={2} 
              borderBottomWidth="2px" 
              borderColor={stageHeaderBg}
            >
              <Heading as="h3" size="md" fontWeight="semibold" fontFamily="Poppins" color={useColorModeValue('gray.700', 'gray.100')}>
                {stage}
              </Heading>
              <Tag size="md" variant="solid" colorScheme="crm-primary" borderRadius="full">
                {opportunitiesByStage[stage]?.length || 0}
              </Tag>
            </HStack>
            <VStack spacing={3} align="stretch" maxHeight="70vh" overflowY="auto" pr={2} 
              css={{
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: useColorModeValue('gray.100', 'gray.700'),
                  borderRadius: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: useColorModeValue('gray.400', 'gray.500'),
                  borderRadius: '8px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: useColorModeValue('gray.500', 'gray.400'),
                },
              }}
            >
              {opportunitiesByStage[stage] && opportunitiesByStage[stage].length > 0 ? (
                opportunitiesByStage[stage].map(op => <OpportunityCard key={op.id} opportunity={op} />)
              ) : (
                <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} textAlign="center" py={4}>
                  No opportunities in this stage.
                </Text>
              )}
            </VStack>
          </Box>
        ))}
      </HStack>
    </Flex>
  );
};
