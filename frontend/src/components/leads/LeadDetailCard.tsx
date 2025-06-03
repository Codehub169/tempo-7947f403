import React from 'react';
import {
  Box, Heading, Text, VStack, HStack, Tag, Icon, Divider, SimpleGrid, useColorModeValue, Avatar, Link, Flex
} from '@chakra-ui/react';
import {
  FiUser, FiBriefcase, FiMail, FiPhone, FiDollarSign, FiActivity, FiInfo, FiCalendar, FiEdit2, FiStar
} from 'react-icons/fi';
import { format } from 'date-fns';
import { LeadFormData } from './LeadForm'; // Assuming LeadFormData is in LeadForm.tsx or a types file

interface LeadDetailCardProps {
  lead: LeadFormData & { createdAt?: Date; updatedAt?: Date; leadOwner?: { name: string; avatarUrl?: string } }; // Extended with more details
  onEdit?: () => void;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | number | React.ReactNode; isLink?: boolean; href?: string }> = 
  ({ icon, label, value, isLink, href }) => {
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const labelColor = useColorModeValue('gray.700', 'gray.200');
  
  if (!value && typeof value !== 'number') return null;

  return (
    <Flex align="flex-start" py={2}>
      <Icon as={icon} color="crm-primary.500" mt={1} mr={3} boxSize={5} flexShrink={0} />
      <Box>
        <Text fontSize="sm" color={textColor} fontWeight="medium">{label}</Text>
        {isLink && href ? (
          <Link href={href} color="crm-primary.500" _hover={{ textDecoration: 'underline' }} isExternal={href.startsWith('http')}>
            <Text fontSize="md" color={labelColor} fontWeight="semibold">{value}</Text>
          </Link>
        ) : (
          <Text fontSize="md" color={labelColor} fontWeight="semibold" whiteSpace={label === 'Description' ? 'pre-wrap' : 'normal'}>{value}</Text>
        )}
      </Box>
    </Flex>
  );
};

const getStatusColorScheme = (status: LeadFormData['status']) => {
  switch (status) {
    case 'New': return 'blue';
    case 'Contacted': return 'cyan';
    case 'Qualified': return 'teal';
    case 'Proposal Sent': return 'purple';
    case 'Negotiation': return 'yellow';
    case 'Won': return 'green';
    case 'Lost': return 'red';
    default: return 'gray';
  }
};

const LeadDetailCard: React.FC<LeadDetailCardProps> = ({ lead, onEdit }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  return (
    <Box bg={cardBg} p={{base: 5, md: 8}} borderRadius="xl" shadow="xl" borderWidth="1px" borderColor={borderColor}>
      <VStack spacing={6} align="stretch">
        {/* Header Section */} 
        <Flex justifyContent="space-between" alignItems="center">
          <HStack spacing={4}>
            <Avatar 
              name={`${lead.firstName} ${lead.lastName}`}
              bg="crm-primary.500" 
              color="white" 
              size="lg" 
              icon={<Icon as={FiUser} boxSize={8}/>} 
            />
            <Box>
              <Heading size="xl" fontFamily="Poppins" color={headingColor}>
                {lead.firstName} {lead.lastName}
              </Heading>
              {lead.company && <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>{lead.company}</Text>}
            </Box>
          </HStack>
          {onEdit && (
            <Button leftIcon={<FiEdit2 />} colorScheme="crm-primary" variant="outline" onClick={onEdit} size="sm">
              Edit Lead
            </Button>
          )}
        </Flex>

        <Divider borderColor={borderColor} />

        {/* Main Details Section */} 
        <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={8} spacingY={4}>
          <DetailItem icon={FiMail} label="Email Address" value={lead.email} isLink href={`mailto:${lead.email}`} />
          {lead.phone && <DetailItem icon={FiPhone} label="Phone Number" value={lead.phone} isLink href={`tel:${lead.phone}`} />}
          {lead.company && <DetailItem icon={FiBriefcase} label="Company" value={lead.company} />}
          
          <VStack align="stretch" spacing={1} py={2}>
            <HStack><Icon as={FiActivity} color="crm-primary.500" mt={0.5} mr={1.5} boxSize={5} /><Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} fontWeight="medium">Lead Status</Text></HStack>
            <Tag size="lg" colorScheme={getStatusColorScheme(lead.status)} variant="solid" borderRadius="full" px={4} py={1.5} maxW="fit-content">
              <Icon as={FiStar} mr={2}/> {lead.status}
            </Tag>
          </VStack>

          {lead.source && <DetailItem icon={FiInfo} label="Lead Source" value={lead.source} />}
          {lead.estimatedValue && <DetailItem icon={FiDollarSign} label="Estimated Value" value={`₹ ${lead.estimatedValue.toLocaleString('en-IN')}`} />}
          
          {lead.leadOwner && (
             <Flex align="flex-start" py={2}>
                <Icon as={FiUser} color="crm-primary.500" mt={1} mr={3} boxSize={5} flexShrink={0} />
                <Box>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} fontWeight="medium">Lead Owner</Text>
                    <HStack>
                        {lead.leadOwner.avatarUrl && <Avatar size="xs" name={lead.leadOwner.name} src={lead.leadOwner.avatarUrl}/>}
                        <Text fontSize="md" color={useColorModeValue('gray.700', 'gray.200')} fontWeight="semibold">{lead.leadOwner.name}</Text>
                    </HStack>
                </Box>
            </Flex>
          )}
        </SimpleGrid>

        {/* Description Section */} 
        {lead.description && (
          <>
            <Divider borderColor={borderColor} />
            <DetailItem icon={FiInfo} label="Description" value={lead.description} />
          </>
        )}
        
        {/* Timestamps Section */} 
        {(lead.createdAt || lead.updatedAt) && <Divider borderColor={borderColor} />}
        <HStack spacing={8} color={useColorModeValue('gray.500', 'gray.500')} fontSize="xs" justifyContent="flex-end">
          {lead.createdAt && (
            <HStack>
              <Icon as={FiCalendar} />
              <Text>Created: {format(new Date(lead.createdAt), 'PPpp')}</Text>
            </HStack>
          )}
          {lead.updatedAt && (
            <HStack>
              <Icon as={FiCalendar} />
              <Text>Last Updated: {format(new Date(lead.updatedAt), 'PPpp')}</Text>
            </HStack>
          )}
        </HStack>

      </VStack>
    </Box>
  );
};

export default LeadDetailCard;
