import React from 'react';
import {
  Box,
  Heading,
  Text,
  Avatar,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Button,
  Link,
  useColorModeValue,
  Divider,
  Tag,
  Tooltip
} from '@chakra-ui/react';
import {
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiLinkedin,
  FiEdit3,
  FiUser,
  FiCalendar,
  FiUsers,
  FiInfo
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import NextLink from 'next/link';
import { ContactFormData } from './ContactForm'; // Assuming ContactFormData is in ContactForm.tsx

// Extend ContactFormData for additional display properties
export interface ContactDetails extends ContactFormData {
  account?: {
    id: string;
    name: string;
  };
  contactOwner?: {
    name: string;
    avatarUrl?: string;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface ContactDetailCardProps {
  contact: ContactDetails;
  onEdit?: () => void;
}

// Helper component to display individual detail items
const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | React.ReactNode; isLink?: boolean; href?: string }> = 
  ({ icon, label, value, isLink, href }) => {
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const labelColor = useColorModeValue('gray.500', 'gray.300');
  if (!value) return null;

  return (
    <HStack align="start" spacing={3} py={2}>
      <Icon as={icon} color="crm-primary.500" mt={1} boxSize={5} />
      <Box>
        <Text fontSize="sm" fontWeight="medium" color={labelColor}>
          {label}
        </Text>
        {isLink && href ? (
          <Link href={href} isExternal={!href.startsWith('/')} color="crm-primary.500" _hover={{ textDecoration: 'underline' }} fontWeight="medium">
            {value}
          </Link>
        ) : (
          <Text fontSize="md" fontWeight="medium" color={textColor} wordBreak="break-word">
            {value}
          </Text>
        )}
      </Box>
    </HStack>
  );
};

const ContactDetailCard: React.FC<ContactDetailCardProps> = ({ contact, onEdit }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const headerTextColor = useColorModeValue('crm-primary.600', 'crm-primary.300');
  const subtleTextColor = useColorModeValue('gray.500', 'gray.400');

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return 'N/A';
    try {
      const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
      return format(date, 'PPP p'); // e.g., Jun 20, 2023, 4:30 PM
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const fullAddress = [
    contact.mailingStreet,
    contact.mailingCity,
    contact.mailingState,
    contact.mailingPostalCode,
    contact.mailingCountry,
  ].filter(Boolean).join(', ');

  return (
    <Box
      bg={cardBg}
      p={{ base: 6, md: 8 }}
      borderRadius="xl"
      shadow="xl"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
    >
      {/* Header Section: Avatar, Name, Title, Edit Button */}
      <HStack justify="space-between" align="start" mb={6}>
        <HStack spacing={4} align="center">
          <Avatar 
            size="xl" 
            name={`${contact.firstName} ${contact.lastName}`}
            src={undefined} /* Placeholder for actual avatar URL */
            bg="crm-primary.100"
            color="crm-primary.600"
            icon={<FiUser fontSize="2.5rem" />}
            borderWidth={2}
            borderColor="crm-primary.500"
          />
          <VStack align="start" spacing={0}>
            <Heading as="h2" size="xl" fontFamily="Poppins" color={headerTextColor}>
              {contact.firstName} {contact.lastName}
            </Heading>
            {contact.jobTitle && (
              <Text fontSize="lg" color={subtleTextColor} fontWeight="medium">
                {contact.jobTitle}
              </Text>
            )}
            {contact.account?.name && (
              <NextLink href={`/accounts/${contact.account.id}`} passHref>
                <Link color="crm-primary.500" fontWeight="medium" _hover={{textDecoration: 'underline'}}>
                  <Icon as={FiBriefcase} mr={1} verticalAlign="middle"/> {contact.account.name}
                </Link>
              </NextLink>
            )}
          </VStack>
        </HStack>
        {onEdit && (
          <Tooltip label="Edit Contact Details" placement="top">
            <Button
              leftIcon={<Icon as={FiEdit3} />}
              onClick={onEdit}
              colorScheme="crm-secondary"
              variant="outline"
              size="sm"
              borderColor={useColorModeValue('gray.300', 'gray.500')}
              _hover={{ 
                bg: useColorModeValue('gray.50', 'gray.600'),
                borderColor: useColorModeValue('gray.400', 'gray.400') 
              }}
            >
              Edit Contact
            </Button>
          </Tooltip>
        )}
      </HStack>

      <Divider my={6} />

      {/* Main Details Section */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={8} spacingY={4}>
        <DetailItem icon={FiMail} label="Email" value={contact.email} isLink href={`mailto:${contact.email}`} />
        <DetailItem icon={FiPhone} label="Phone" value={contact.phone} isLink href={`tel:${contact.phone}`} />
        <DetailItem icon={FiPhone} label="Mobile Phone" value={contact.mobilePhone} isLink href={`tel:${contact.mobilePhone}`} />
        {contact.account?.name && (
          <DetailItem 
            icon={FiBriefcase} 
            label="Account"
            value={contact.account.name}
            isLink
            href={`/accounts/${contact.account.id}`}
          />
        )}
        <DetailItem icon={FiUsers} label="Department" value={contact.department} />
        {contact.linkedinProfile && (
           <DetailItem icon={FiLinkedin} label="LinkedIn Profile" value={contact.linkedinProfile} isLink href={contact.linkedinProfile} />
        )}
      </SimpleGrid>

      {/* Address Details */}
      {fullAddress && (
        <>
          <Divider my={6} />
          <DetailItem icon={FiMapPin} label="Mailing Address" value={fullAddress} />
        </>
      )}

      {/* Description */}
      {contact.description && (
        <>
          <Divider my={6} />
          <DetailItem icon={FiInfo} label="Description" value={<Text whiteSpace="pre-wrap">{contact.description}</Text>} />
        </>
      )}
      
      <Divider my={6} />

      {/* Audit and Ownership Information */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={8} spacingY={4} mt={4}>
        {contact.contactOwner?.name && (
          <DetailItem 
            icon={FiUser} 
            label="Contact Owner" 
            value={
              <HStack>
                <Avatar size="xs" name={contact.contactOwner.name} src={contact.contactOwner.avatarUrl} mr={1}/>
                <Text>{contact.contactOwner.name}</Text>
              </HStack>
            }
          />
        )}
        <DetailItem icon={FiCalendar} label="Created At" value={formatDate(contact.createdAt)} />
        <DetailItem icon={FiCalendar} label="Last Updated" value={formatDate(contact.updatedAt)} />
      </SimpleGrid>

    </Box>
  );
};

export default ContactDetailCard;
