import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Spinner,
  Text,
  useColorModeValue,
  Icon,
  Flex,
  TableContainer,
  TableCaption,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { FiAlertCircle, FiInbox, FiChevronUp, FiChevronDown } from 'react-icons/fi';

export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | ((row: T) => any);
  cell?: (value: any, row: T) => React.ReactNode;
  isNumeric?: boolean;
  sortable?: boolean;
}

interface EntityTableProps<T extends { id: string | number }> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  error?: Error | null;
  emptyStateMessage?: string;
  onRowClick?: (row: T) => void;
  renderRowActions?: (row: T) => React.ReactNode;
  caption?: string;
  sortBy?: keyof T | string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnId: keyof T | string) => void;
}

export function EntityTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  error = null,
  emptyStateMessage = 'No data available.',
  onRowClick,
  renderRowActions,
  caption,
  sortBy,
  sortDirection,
  onSort,
}: EntityTableProps<T>) {
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.800');
  const headerTextColor = useColorModeValue('gray.600', 'gray.400');

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" color="crm-primary.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" align="center" justify="center" minH="200px" color="red.500">
        <Icon as={FiAlertCircle} w={8} h={8} mb={3} />
        <Text fontWeight="medium">Error loading data: {error.message}</Text>
      </Flex>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" minH="200px" color={textColor}>
        <Icon as={FiInbox} w={10} h={10} mb={4} color="crm-primary.300"/>
        <Text fontSize="xl" fontWeight="medium">{emptyStateMessage}</Text>
      </Flex>
    );
  }

  const getCellValue = (row: T, column: ColumnDef<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor as keyof T];
  };

  return (
    <TableContainer border="1px" borderColor={borderColor} borderRadius="lg" boxShadow="sm">
      <Table variant="simple">
        {caption && <TableCaption placement="top" m={0} p={4} bg={headerBg} borderTopRadius="lg" fontWeight="semibold" color={headerTextColor}>{caption}</TableCaption>}
        <Thead bg={headerBg}>
          <Tr>
            {columns.map((col, index) => (
              <Th 
                key={index.toString()} 
                isNumeric={col.isNumeric} 
                onClick={col.sortable && onSort ? () => onSort(typeof col.accessor === 'string' ? col.accessor : col.header) : undefined}
                cursor={col.sortable && onSort ? 'pointer' : 'default'}
                _hover={col.sortable && onSort ? { bg: hoverBg } : {}}
                color={headerTextColor}
                textTransform="uppercase"
                fontSize="xs"
                letterSpacing="wider"
                py={4}
              >
                <Flex align="center">
                  {col.header}
                  {col.sortable && onSort && sortBy === (typeof col.accessor === 'string' ? col.accessor : col.header) && (
                    <Icon 
                      as={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} 
                      ml={1} 
                      aria-label={sortDirection === 'asc' ? 'Sorted ascending' : 'Sorted descending'}
                    />
                  )}
                </Flex>
              </Th>
            ))}
            {renderRowActions && <Th color={headerTextColor} textTransform="uppercase" fontSize="xs" letterSpacing="wider" py={4}>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => (
            <Tr 
              key={row.id}
              _hover={{ bg: hoverBg, cursor: onRowClick ? 'pointer' : 'default' }} 
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              borderBottomWidth="1px"
              borderColor={borderColor}
            >
              {columns.map((col, index) => (
                <Td key={index.toString()} isNumeric={col.isNumeric} py={3} px={4} color={textColor}>
                  {col.cell ? col.cell(getCellValue(row, col), row) : String(getCellValue(row, col))}
                </Td>
              ))}
              {renderRowActions && (
                <Td py={3} px={4}>
                  {renderRowActions(row)}
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default EntityTable;
