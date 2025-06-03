import { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { 
  Container, 
  Heading, 
  Text, 
  Spinner, 
  Box, 
  Flex, 
  Icon, 
  SimpleGrid,
  Card, 
  CardHeader, 
  CardBody, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel, 
  useColorModeValue,
  Select,
  Stack,
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup,
  Divider
} from '@chakra-ui/react';
import { FiBarChart2, FiPieChart, FiActivity, FiTrendingUp, FiFilter, FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi';
import { Layout } from '@/components/common/Layout';
// import ReportChart from '@/components/reports/ReportChart'; // Placeholder
// import ReportDataTable from '@/components/reports/ReportDataTable'; // Placeholder

// Mock data for demonstration
const mockPipelineData = {
  labels: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'],
  datasets: [
    {
      label: 'Opportunities by Stage',
      data: [12, 19, 8, 5, 3],
      backgroundColor: ['#A0AEC0', '#63B3ED', '#F6AD55', '#B794F4', '#68D391'],
    },
  ],
};

const mockLeadSourceData = {
  labels: ['Website', 'Referral', 'Cold Call', 'Partner', 'Advertisement'],
  datasets: [
    {
      label: 'Leads by Source',
      data: [300, 150, 100, 80, 50],
      backgroundColor: ['#4299E1', '#48BB78', '#ED8936', '#ECC94B', '#9F7AEA'],
    },
  ],
};

const mockTeamActivityData = [
  { rep: 'Sarah Miller', calls: 25, emails: 50, meetings: 10 },
  { rep: 'John Doe', calls: 30, emails: 45, meetings: 8 },
  { rep: 'Alice Brown', calls: 20, emails: 60, meetings: 12 },
];

const ReportsPage: NextPage & { getLayout?: (page: ReactElement) => ReactElement } = () => {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last30days');

  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const subtleTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (authStatus === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    // Simulate API call to fetch report data based on dateRange
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [session, authStatus, router, dateRange]);

  if (isLoading || authStatus === 'loading') {
    return (
      <Flex justify="center" align="center" minH="calc(100vh - 120px)">
        <Spinner size="xl" color="crm-primary.500" />
      </Flex>
    );
  }

  return (
    <>
      <Head>
        <title>Reports & Analytics | ClientFlow CRM</title>
        <meta name="description" content="View sales reports, pipeline analytics, and team performance." />
      </Head>

      <Container maxW="container.xl" py={8} px={{ base: 4, md: 8 }}>
        <Flex justify="space-between" align="center" mb={6} direction={{ base: 'column', md: 'row' }} gap={4}>
          <Flex align="center">
            <Icon as={FiBarChart2} color="crm-primary.500" boxSize={8} mr={3} />
            <Heading as="h1" size="xl" fontWeight="bold" color={textColor}>
              Reports & Analytics
            </Heading>
          </Flex>
          <Select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)} 
            icon={<FiCalendar />} 
            w={{ base: 'full', md: '250px' }}
            bg={useColorModeValue('white', 'gray.700')}
            shadow="sm"
            _hover={{ borderColor: 'crm-primary.300' }}
            _focus={{ borderColor: 'crm-primary.500', boxShadow: `0 0 0 1px var(--chakra-colors-crm-primary-500)` }}
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisQuarter">This Quarter</option>
          </Select>
        </Flex>

        <Tabs variant="soft-rounded" colorScheme="crm-primary" mb={8}>
          <TabList overflowX={{base: "scroll", md: "auto"}} pb={2}>
            <Tab fontWeight="semibold"><Icon as={FiTrendingUp} mr={2}/>Sales Pipeline</Tab>
            <Tab fontWeight="semibold"><Icon as={FiPieChart} mr={2}/>Lead Sources</Tab>
            <Tab fontWeight="semibold"><Icon as={FiActivity} mr={2}/>Team Activity</Tab>
            <Tab fontWeight="semibold"><Icon as={FiDollarSign} mr={2}/>Revenue Forecast</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Card bg={cardBg} shadow="lg" borderRadius="lg" borderColor={borderColor} borderWidth={1}>
                <CardHeader>
                  <Heading size="md" color={textColor}>Sales Pipeline by Stage</Heading>
                </CardHeader>
                <CardBody>
                  <Text color={subtleTextColor} mb={4}>Visual representation of opportunities in each stage of the sales funnel.</Text>
                  {/* <ReportChart type="bar" data={mockPipelineData} /> */}
                  <Box h="300px" bg={useColorModeValue('gray.50', 'gray.800')} display="flex" alignItems="center" justifyContent="center" borderRadius="md">
                    <Text color={subtleTextColor}>Pipeline Chart Placeholder (Bar/Funnel)</Text>
                  </Box>
                  <StatGroup mt={6} textAlign="center">
                    <Stat>
                      <StatLabel>Total Open Pipeline</StatLabel>
                      <StatNumber>₹{mockPipelineData.datasets[0].data.slice(0, -1).reduce((a, b) => a + b * 10000, 0).toLocaleString('en-IN')}</StatNumber>
                      <StatHelpText>Based on current filter</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Conversion Rate (Est.)</StatLabel>
                      <StatNumber>25%</StatNumber>
                       <StatHelpText>
                        <StatArrow type="increase" />
                        5% from last period
                      </StatHelpText>
                    </Stat>
                  </StatGroup>
                </CardBody>
              </Card>
            </TabPanel>
            <TabPanel>
              <Card bg={cardBg} shadow="lg" borderRadius="lg" borderColor={borderColor} borderWidth={1}>
                <CardHeader>
                  <Heading size="md" color={textColor}>Lead Source Performance</Heading>
                </CardHeader>
                <CardBody>
                  <Text color={subtleTextColor} mb={4}>Effectiveness of different channels in generating leads.</Text>
                  {/* <ReportChart type="pie" data={mockLeadSourceData} /> */}
                  <Box h="300px" bg={useColorModeValue('gray.50', 'gray.800')} display="flex" alignItems="center" justifyContent="center" borderRadius="md">
                     <Text color={subtleTextColor}>Lead Source Chart Placeholder (Pie/Bar)</Text>
                  </Box>
                   <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={6}>
                    {mockLeadSourceData.labels.map((label, index) => (
                        <Flex key={label} justifyContent="space-between" p={2} bg={useColorModeValue('gray.50', 'gray.600')} borderRadius="md">
                            <Text fontWeight="medium">{label}</Text>
                            <Text fontWeight="bold" color="crm-primary.500">{mockLeadSourceData.datasets[0].data[index]}</Text>
                        </Flex>
                    ))}
                   </SimpleGrid>
                </CardBody>
              </Card>
            </TabPanel>
            <TabPanel>
              <Card bg={cardBg} shadow="lg" borderRadius="lg" borderColor={borderColor} borderWidth={1}>
                <CardHeader>
                  <Heading size="md" color={textColor}>Team Activity Summary</Heading>
                </CardHeader>
                <CardBody>
                  <Text color={subtleTextColor} mb={4}>Overview of sales activities logged by team members.</Text>
                  {/* <ReportDataTable columns={[...]} data={mockTeamActivityData} /> */}
                  <Box minH="300px" bg={useColorModeValue('gray.50', 'gray.800')} p={4} borderRadius="md">
                    <Text color={subtleTextColor} fontWeight="bold" mb={2}>Activity Data Table Placeholder</Text>
                    {mockTeamActivityData.map(item => (
                        <Flex key={item.rep} justifyContent="space-between" py={2} borderBottomWidth="1px" borderColor={borderColor}>
                            <Text fontWeight="medium">{item.rep}</Text>
                            <HStack spacing={4}>
                                <Text fontSize="sm">Calls: {item.calls}</Text>
                                <Text fontSize="sm">Emails: {item.emails}</Text>
                                <Text fontSize="sm">Meetings: {item.meetings}</Text>
                            </HStack>
                        </Flex>
                    ))}
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>
            <TabPanel>
                <Card bg={cardBg} shadow="lg" borderRadius="lg" borderColor={borderColor} borderWidth={1}>
                    <CardHeader>
                        <Heading size="md" color={textColor}>Revenue Forecast</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text color={subtleTextColor} mb={4}>Projected revenue based on open opportunities and historical data.</Text>
                        <Box h="300px" bg={useColorModeValue('gray.50', 'gray.800')} display="flex" alignItems="center" justifyContent="center" borderRadius="md">
                            <Text color={subtleTextColor}>Revenue Forecast Chart Placeholder (Line Chart)</Text>
                        </Box>
                        <StatGroup mt={6} textAlign="center">
                            <Stat>
                                <StatLabel>Projected This Quarter</StatLabel>
                                <StatNumber>₹1,250,000</StatNumber>
                                <StatHelpText>
                                    <StatArrow type="increase" />
                                    12% vs last quarter
                                </StatHelpText>
                            </Stat>
                            <Stat>
                                <StatLabel>Weighted Forecast</StatLabel>
                                <StatNumber>₹875,000</StatNumber>
                                <StatHelpText>Based on probability</StatHelpText>
                            </Stat>
                        </StatGroup>
                    </CardBody>
                </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
      </Container>
    </>
  );
};

ReportsPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ReportsPage;
