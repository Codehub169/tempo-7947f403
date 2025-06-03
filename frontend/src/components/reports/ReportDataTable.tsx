import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Heading,
  Spinner,
  Text,
  Icon,
  Flex,
  useColorModeValue,
  TableCaption,
} from '@chakra-ui/react';
import { FiAlertTriangle, FiInbox, FiFileText } from 'react-icons/fi';

// Generic type for column definitions
export interface ReportColumn<T extends Record<string, any>> {
  key: Extract<keyof T, string> | string; // Accessor key or a unique string for custom rendering
  header: string; // Header text for the column
  renderCell?: (row: T) => React.ReactNode; // Optional custom cell renderer
  isNumeric?: boolean; // For text alignment
}

interface ReportDataTableProps<T extends Record<string, any>> {
  title: string; // Title of the report table
  data: T[]; // Array of data objects to display
  columns: ReportColumn<T>[]; // Column definitions
  isLoading?: boolean; // True if data is currently loading
  error?: string | null; // Error message to display, if any
  emptyText?: string; // Custom text for empty state
  caption?: string; // Optional table caption
}

/**
 * ReportDataTable: A reusable and styled data table component for displaying report data.
 * It handles loading, error, and empty states.
 */
const ReportDataTable = <T extends Record<string, any>>({
  title,
  data,
  columns,
  isLoading = false,
  error = null,
  emptyText = 'No data available for this report.',
  caption,
}: ReportDataTableProps<T>) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const secondaryTextColor = useColorModeValue('gray.500', 'gray.400');

  // Render table content based on state
  const renderContent = () => {
    if (isLoading) {
      return (
        <Flex direction="column" align="center" justify="center" p={10} minH="200px">
          <Spinner size="xl" color="crm-primary.500" thickness="4px" />
          <Text mt={4} fontSize="lg" fontWeight="medium" color={textColor}>
            Loading report data...
          </Text>
        </Flex>
      );
    }

    if (error) {
      return (
        <Flex direction="column" align="center" justify="center" p={10} minH="200px" textAlign="center">
          <Icon as={FiAlertTriangle} w={12} h={12} color="red.500" mb={4} />
          <Heading as="h4" size="md" color="red.500" mb={2}>
            Error Loading Report
          </Heading>
          <Text color={secondaryTextColor}>{error}</Text>
        </Flex>
      );
    }

    if (data.length === 0) {
      return (
        <Flex direction="column" align="center" justify="center" p={10} minH="200px" textAlign="center">
          <Icon as={FiInbox} w={12} h={12} color="crm-primary.400" mb={4} />
          <Heading as="h4" size="md" color={textColor} mb={2}>
            No Data
          </Heading>
          <Text color={secondaryTextColor}>{emptyText}</Text>
        </Flex>
      );
    }

    return (
      <TableContainer>
        <Table variant="simple" colorScheme="gray">
          {caption && <TableCaption placement="top">{caption}</TableCaption>}
          <Thead bg={headerBg}>
            <Tr>
              {columns.map((col) => (
                <Th key={String(col.key)} isNumeric={col.isNumeric} color={secondaryTextColor} textTransform="uppercase" letterSpacing="wider" fontSize="xs" py={3}>
                  {col.header}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, rowIndex) => (
              <Tr key={`row-${rowIndex}`} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                {columns.map((col) => (
                  <Td key={`cell-${rowIndex}-${String(col.key)}`} isNumeric={col.isNumeric} borderColor={borderColor} color={textColor} fontSize="sm">
                    {col.renderCell ? col.renderCell(row) : String(row[col.key as Extract<keyof T, string>] ?? '')}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box bg={cardBg} borderRadius="xl" boxShadow="lg" p={0} overflow="hidden" borderWidth="1px" borderColor={borderColor}>
      <Flex align="center" p={5} borderBottomWidth="1px" borderColor={borderColor}>
        <Icon as={FiFileText} w={6} h={6} color="crm-primary.500" />
        <Heading as="h3" size="md" ml={3} color={textColor} fontFamily="Poppins">
          {title}
        </Heading>
      </Flex>
      {renderContent()}
    </Box>
  );
};

export default ReportDataTable;
