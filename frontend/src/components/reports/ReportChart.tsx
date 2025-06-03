import React, { useState } from 'react'; // Added useState for PieChart activeIndex
import {
  Box, Heading, Text, Icon, useColorModeValue, Center, Spinner, VStack
} from '@chakra-ui/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Sector // For active shape in Pie/Doughnut
} from 'recharts';
import { FiBarChart2, FiAlertCircle, FiPieChart, FiTrendingUp } from 'react-icons/fi';

export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut';

// A generic data structure, specific charts might need more tailored data.
export interface ChartDataItem {
  name: string; // Typically for XAxis labels or Pie slices
  value: number; // Typically for YAxis values or Pie slice values
  [key: string]: any; // Allow other data keys for multiple bars/lines
}

export interface ReportChartProps {
  type: ChartType;
  data: ChartDataItem[];
  title?: string;
  isLoading?: boolean;
  height?: number | string;
  colors?: string[]; // Custom colors for chart elements
  dataKey?: string; // Key for the main value, defaults to 'value'
  categoryKey?: string; // Key for categories/labels, defaults to 'name'
  // Additional props for specific chart types or advanced customization can be added
}

// Default colors for charts, can be overridden by props
const DEFAULT_CHART_COLORS = ['#0056B3', '#28A745', '#FFC107', '#DC3545', '#6C757D', '#17A2B8', '#6610F2'];

const CustomTooltip = ({ active, payload, label }: any) => {
  const tooltipBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  if (active && payload && payload.length) {
    return (
      <Box bg={tooltipBg} p={3} borderRadius="md" boxShadow="lg" borderColor={useColorModeValue('gray.200', 'gray.600')} borderWidth={1}>
        <Text fontWeight="bold" color={textColor} mb={1}>{`${label}`}</Text>
        {payload.map((pld: any, index: number) => (
          <Text key={index} fontSize="sm" color={textColor} style={{ color: pld.fill || pld.stroke }}>
            {`${pld.name}: ${pld.value.toLocaleString()}`}
          </Text>
        ))}
      </Box>
    );
  }
  return null;
};

// Active shape for Doughnut chart (from Recharts examples)
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontWeight="bold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontWeight="semibold">{`${value.toLocaleString()}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const ReportChart: React.FC<ReportChartProps> = ({
  type,
  data,
  title,
  isLoading = false,
  height = 300,
  colors = DEFAULT_CHART_COLORS,
  dataKey = 'value',
  categoryKey = 'name',
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const gridColor = useColorModeValue('gray.200', 'gray.700');
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  if (isLoading) {
    return (
      <Center h={height} bg={cardBg} borderRadius="xl" shadow="lg" p={6} borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <VStack>
          <Spinner size="xl" color="crm-primary.500" thickness="4px" />
          <Text mt={3} fontFamily="Inter" color={textColor}>Loading Chart Data...</Text>
        </VStack>
      </Center>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Center h={height} bg={cardBg} borderRadius="xl" shadow="lg" p={6} borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <VStack spacing={3}>
          <Icon as={FiAlertCircle} boxSize={10} color="gray.400" />
          <Heading as="h4" size="md" fontFamily="Poppins" color={textColor}>No Data Available</Heading>
          <Text fontSize="sm" color={textColor}>There is no data to display for this chart.</Text>
        </VStack>
      </Center>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={categoryKey} stroke={textColor} tick={{ fontSize: 12, fontFamily: 'Inter' }} />
            <YAxis stroke={textColor} tick={{ fontSize: 12, fontFamily: 'Inter' }} />
            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: useColorModeValue('blackAlpha.100', 'whiteAlpha.100') }}/>
            <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: '12px' }} />
            <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
            {/* Add more <Bar /> components if data has multiple series */}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={categoryKey} stroke={textColor} tick={{ fontSize: 12, fontFamily: 'Inter' }} />
            <YAxis stroke={textColor} tick={{ fontSize: 12, fontFamily: 'Inter' }} />
            <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }}/>
            <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: '12px' }} />
            <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            {/* Add more <Line /> components if data has multiple series */}
          </LineChart>
        );
      case 'pie':
      case 'doughnut':
        return (
          <PieChart>
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: '12px' }} iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
            <Pie
              activeIndex={activeIndex}
              activeShape={type === 'doughnut' ? renderActiveShape : undefined} // Use custom shape for doughnut hover
              data={data}
              cx="50%"
              cy="50%"
              labelLine={type === 'pie'}
              label={type === 'pie' ? ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)` : undefined}
              outerRadius={type === 'doughnut' ? '70%' : '80%'}
              innerRadius={type === 'doughnut' ? '45%' : 0}
              fill="#8884d8"
              dataKey={dataKey}
              onMouseEnter={type === 'doughnut' ? onPieEnter : undefined}
              paddingAngle={type === 'doughnut' ? 2 : 0}
              cornerRadius={type === 'doughnut' ? 5 : 0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke={cardBg} strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        );
      default:
        return <Text color="red.500">Unsupported chart type: {type}</Text>;
    }
  };

  const ChartIcon = type === 'pie' || type === 'doughnut' ? FiPieChart : type === 'line' ? FiTrendingUp : FiBarChart2;

  return (
    <Box bg={cardBg} p={6} borderRadius="xl" shadow="lg" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
      {title && (
        <Heading as="h3" size="md" mb={6} fontFamily="Poppins" color={textColor} display="flex" alignItems="center">
          <Icon as={ChartIcon} mr={2} color="crm-primary.500" /> {title}
        </Heading>
      )}
      <Box style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ReportChart;
