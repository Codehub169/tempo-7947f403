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
  FiBriefcase,
  FiDollarSign,
  FiUsers,
  FiGlobe,
  FiPhone,
  FiMapPin,
  FiEdit3,
  FiCalendar,
  FiUser,
  FiTrendingUp,
  FiTag,
  FiInfo
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { AccountFormData } from './AccountForm'; // Assuming AccountFormData is in AccountForm.tsx

// Extend AccountFormData for additional display properties
export interface AccountDetails extends AccountFormData {
  accountOwner?: {
    name: string;
    avatarUrl?: string;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface AccountDetailCardProps {
  account: AccountDetails;
  onEdit?: () => void;
}

// Helper component to display individual detail items
const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | React.ReactNode; isLink?: boolean; href?: string; currency?: string }> = 
  ({ icon, label, value, isLink, href, currency }) => {
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const labelColor = useColorModeValue('gray.500', 'gray.400');
  if (value === undefined || value === null || value === '') return null;

  let displayValue = value;
  if (currency && typeof value === 'number') {
    try {
      displayValue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency, minimumFractionDigits: 0 }).format(value);
    } catch (e) { /* fallback to raw value */ }
  } else if (currency && typeof value === 'string' && !isNaN(parseFloat(value))) {
     try {
      displayValue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency, minimumFractionDigits: 0 }).format(parseFloat(value));
    } catch (e) { /* fallback to raw value */ }
  }

  return (
    <HStack align="start" spacing={3} py={2}>
      <Icon as={icon} color="crm-primary.500" mt={1} boxSize={5} />
      <Box>
        <Text fontSize="sm" fontWeight="medium" color={labelColor}>
          {label}
        </Text>
        {isLink && href ? (
          <Link href={href} isExternal color="crm-primary.500" _hover={{ textDecoration: 'underline' }} fontWeight="medium">
            {displayValue}
          </Link>
        ) : (
          <Text fontSize="md" fontWeight="medium" color={textColor} wordBreak="break-word">
            {displayValue}
          </Text>
        )}
      </Box>
    </HStack>
  );
};

const getAccountTypeColorScheme = (type?: string) => {
  switch (type) {
    case 'Customer': return 'green';
    case 'Prospect': return 'blue';
    case 'Partner': return 'purple';
    case 'Vendor': return 'orange';
    default: return 'gray';
  }
};

const AccountDetailCard: React.FC<AccountDetailCardProps> = ({ account, onEdit }) => {
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

  const billingAddress = [account.billingStreet, account.billingCity, account.billingState, account.billingPostalCode, account.billingCountry].filter(Boolean).join(', ');
  const shippingAddress = [account.shippingStreet, account.shippingCity, account.shippingState, account.shippingPostalCode, account.shippingCountry].filter(Boolean).join(', ');

  return (
    <Box
      bg={cardBg}
      p={{ base: 6, md: 8 }}
      borderRadius="xl"
      shadow="xl"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
    >
      {/* Header Section: Icon, Name, Type, Edit Button */}
      <HStack justify="space-between" align="start" mb={6}>
        <HStack spacing={4} align="center">
          <Avatar 
            size="xl" 
            name={account.accountName}
            icon={<FiBriefcase fontSize="2.5rem" />}
            bg="crm-primary.100"
            color="crm-primary.600"
            borderWidth={2}
            borderColor="crm-primary.500"
          />
          <VStack align="start" spacing={1}>
            <Heading as="h2" size="xl" fontFamily="Poppins" color={headerTextColor}>
              {account.accountName}
            </Heading>
            <HStack>
                {account.industry && (
                    <Text fontSize="md" color={subtleTextColor} fontWeight="medium">
                        <Icon as={FiTrendingUp} mr={1} verticalAlign="middle" /> {account.industry}
                    </Text>
                )}
                {account.type && (
                    <Tag size="md" colorScheme={getAccountTypeColorScheme(account.type)} variant="subtle" fontWeight="bold">
                        <Icon as={FiTag} mr={1.5} /> {account.type}
                    </Tag>
                )}
            </HStack>
          </VStack>
        </HStack>
        {onEdit && (
          <Tooltip label="Edit Account Details" placement="top">
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
              Edit Account
            </Button>
          </Tooltip>
        )}
      </HStack>

      <Divider my={6} />

      {/* Main Details Section */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={8} spacingY={4}>
        <DetailItem icon={FiGlobe} label="Website" value={account.website} isLink href={account.website} />
        <DetailItem icon={FiPhone} label="Phone" value={account.phone} isLink href={`tel:${account.phone}`} />
        <DetailItem icon={FiDollarSign} label="Annual Revenue" value={account.annualRevenue} currency="INR" />
        <DetailItem icon={FiUsers} label="Number of Employees" value={account.numberOfEmployees?.toString()} />
      </SimpleGrid>

      {/* Address Details */}
      {(billingAddress || shippingAddress) && <Divider my={6} />}
      {billingAddress && (
          <DetailItem icon={FiMapPin} label="Billing Address" value={billingAddress} />
      )}
      {shippingAddress && billingAddress !== shippingAddress && (
          <DetailItem icon={FiMapPin} label="Shipping Address" value={shippingAddress} />
      )}
      {shippingAddress && billingAddress === shippingAddress && (
          <DetailItem icon={FiMapPin} label="Billing & Shipping Address" value={billingAddress} />
      )}

      {/* Description */}
      {account.description && (
        <>
          <Divider my={6} />
          <DetailItem icon={FiInfo} label="Description" value={<Text whiteSpace="pre-wrap">{account.description}</Text>} />
        </>
      )}

      <Divider my={6} />

      {/* Audit and Ownership Information */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={8} spacingY={4} mt={4}>
        {account.accountOwner?.name && (
          <DetailItem 
            icon={FiUser} 
            label="Account Owner" 
            value={
              <HStack>
                <Avatar size="xs" name={account.accountOwner.name} src={account.accountOwner.avatarUrl} mr={1}/>
                <Text>{account.accountOwner.name}</Text>
              </HStack>
            }
          />
        )}
        <DetailItem icon={FiCalendar} label="Created At" value={formatDate(account.createdAt)} />
        <DetailItem icon={FiCalendar} label="Last Updated" value={formatDate(account.updatedAt)} />
      </SimpleGrid>

    </Box>
  );
};

export default AccountDetailCard;
