import Head from 'next/head';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Button,
  Flex,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Spinner,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  useColorModeValue,
  IconButton,
  Tooltip,
  Tag,
  Select,
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash, FiBuilding, FiFilter } from 'react-icons/fi';

// Placeholder type - replace with actual type from src/types/index.ts later
interface IAccount {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  ownerName: string; // Sales rep owning the account
  type: 'Prospect' | 'Customer' | 'Partner' | 'Vendor' | 'Other';
  annualRevenue?: number;
  numberOfEmployees?: number;
  createdAt: string;
}

const AccountsListPage = () => {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const tableBgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const primaryColor = 'blue.500'; // Corresponds to crm-primary
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Mock data - replace with API calls
  const mockAccounts: IAccount[] = [
    { id: 'innovate-solutions-ltd', name: 'Innovate Solutions Ltd.', industry: 'Software Development', website: 'https://innovate.com', phone: '040-12345678', ownerName: 'Riya Singh', type: 'Customer', annualRevenue: 50000000, numberOfEmployees: 150, createdAt: '2022-05-10' },
    { id: 'techgenix-pvt-ltd', name: 'TechGenix Pvt. Ltd.', industry: 'IT Consulting', website: 'https://techgenix.co.in', phone: '080-98765432', ownerName: 'Amit Kumar', type: 'Prospect', annualRevenue: 10000000, numberOfEmployees: 50, createdAt: '2023-01-20' },
    { id: 'digital-dreams-inc', name: 'Digital Dreams Inc.', industry: 'Digital Marketing', website: 'https://digitaldreams.io', ownerName: 'Riya Singh', type: 'Partner', numberOfEmployees: 25, createdAt: '2022-11-01' },
    { id: 'cloudsys-technologies', name: 'CloudSys Technologies', industry: 'Cloud Services', phone: '022-55557777', ownerName: 'Priya Sharma', type: 'Customer', annualRevenue: 120000000, numberOfEmployees: 300, createdAt: '2021-08-15' },
    { id: 'datasecure-corp', name: 'DataSecure Corp', industry: 'Cybersecurity', website: 'https://datasecure.com', ownerName: 'Vikram Patel', type: 'Vendor', createdAt: '2023-03-01' },
  ];

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
    }
    if (authStatus === 'authenticated') {
      // Simulate API call
      setTimeout(() => {
        setAccounts(mockAccounts);
        setIsLoading(false);
      }, 1000);
    }
  }, [authStatus, router]);

  const filteredAccounts = accounts
    .filter(account => 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.industry && account.industry.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(account => typeFilter ? account.type === typeFilter : true);

  const getTypeTagColor = (type: IAccount['type']) => {
    switch (type) {
      case 'Customer': return 'green';
      case 'Prospect': return 'blue';
      case 'Partner': return 'purple';
      case 'Vendor': return 'orange';
      default: return 'gray';
    }
  };

  if (authStatus === 'loading' || isLoading) {
    return (
      <Flex justify="center" align="center" minH="calc(100vh - 160px)" bg={bgColor}>
        <Spinner size="xl" color={primaryColor} />
      </Flex>
    );
  }

  return (
    <>
      <Head>
        <title>Accounts | ClientFlow CRM</title>
      </Head>
      <Container maxW="container.xl" py={8} bg={bgColor}>
        <Flex mb={6} align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
          <Flex align="center">
            <Icon as={FiBuilding} w={8} h={8} color={primaryColor} mr={3} />
            <Heading as="h1" size="xl" color={textColor} flexShrink={0}>
              Accounts Management
            </Heading>
          </Flex>
          <Spacer />
          <NextLink href="/accounts/new" passHref legacyBehavior> {/* Assuming /accounts/new */}
            <Button as="a" leftIcon={<FiPlus />} colorScheme="blue" variant="solid" shadow="md" _hover={{ shadow: 'lg' }}>
              Add New Account
            </Button>
          </NextLink>
        </Flex>

        <Box bg={tableBgColor} p={6} borderRadius="xl" shadow="lg">
          <Flex mb={4} gap={4} direction={{ base: 'column', md: 'row' }}>
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input 
                type="text" 
                placeholder="Search accounts (name, industry)..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                bg={useColorModeValue('white', 'gray.800')}
                _hover={{ borderColor: primaryColor }}
                _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
              />
            </InputGroup>
            <Select 
              placeholder="Filter by Type" 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              icon={<FiFilter />}
              bg={useColorModeValue('white', 'gray.800')}
              _hover={{ borderColor: primaryColor }}
              _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
              w={{ base: 'full', md: '200px' }}
            >
              <option value="">All Types</option>
              <option value="Prospect">Prospect</option>
              <option value="Customer">Customer</option>
              <option value="Partner">Partner</option>
              <option value="Vendor">Vendor</option>
              <option value="Other">Other</option>
            </Select>
          </Flex>

          {filteredAccounts.length === 0 && !isLoading ? (
            <Text textAlign="center" py={10} color={textColor}>
              No accounts found. Try adjusting your search or filters.
            </Text>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple" color={textColor}>
                <Thead>
                  <Tr>
                    <Th>Account Name</Th>
                    <Th>Industry</Th>
                    <Th>Type</Th>
                    <Th>Phone</Th>
                    <Th>Website</Th>
                    <Th>Owner</Th>
                    <Th>Created At</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredAccounts.map((account) => (
                    <Tr key={account.id} _hover={{ bg: useColorModeValue('gray.100', 'gray.600'), transition: 'background-color 0.2s ease-in-out' }}>
                      <Td borderColor={borderColor}>
                        <NextLink href={`/accounts/${account.id}`} passHref legacyBehavior>
                           <Link fontWeight="medium" color={primaryColor} _hover={{ textDecoration: 'underline' }}>{account.name}</Link>
                        </NextLink>
                      </Td>
                      <Td borderColor={borderColor}>{account.industry || '-'}</Td>
                      <Td borderColor={borderColor}>
                        <Tag colorScheme={getTypeTagColor(account.type)} variant="subtle" px={2} py={1} borderRadius="md">
                          {account.type}
                        </Tag>
                      </Td>
                      <Td borderColor={borderColor}>{account.phone || '-'}</Td>
                      <Td borderColor={borderColor}>
                        {account.website ? (
                          <Link href={account.website} isExternal color={primaryColor} _hover={{ textDecoration: 'underline' }}>
                            {account.website.replace(/^https?:\/\//, '')}
                          </Link>
                        ) : '-'}
                      </Td>
                      <Td borderColor={borderColor}>{account.ownerName}</Td>
                      <Td borderColor={borderColor}>{new Date(account.createdAt).toLocaleDateString()}</Td>
                      <Td borderColor={borderColor}>
                        <Flex gap={2}>
                          <NextLink href={`/accounts/${account.id}`} passHref legacyBehavior>
                            <Tooltip label="View Account" hasArrow>
                              <IconButton as="a" icon={<FiEye />} aria-label="View Account" variant="ghost" colorScheme="blue" size="sm" />
                            </Tooltip>
                          </NextLink>
                          <Tooltip label="Edit Account (coming soon)" hasArrow>
                            <IconButton icon={<FiEdit />} aria-label="Edit Account" variant="ghost" colorScheme="yellow" isDisabled size="sm" />
                          </Tooltip>
                          <Tooltip label="Delete Account (coming soon)" hasArrow>
                            <IconButton icon={<FiTrash />} aria-label="Delete Account" variant="ghost" colorScheme="red" isDisabled size="sm" />
                          </Tooltip>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default AccountsListPage;
