// src/components/RiskChart.tsx
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Box, Heading, Text, VStack, Divider } from '@chakra-ui/react';

interface RiskFactor {
    feature: string;
    shap_score: number;
}

interface Props {
    factors: RiskFactor[];
}

// Helper to translate code to English
const getExplanation = (feature: string, score: number) => {
    if (feature === "AMT_ANNUITY") return "Loan EMI is too high relative to monthly income.";
    if (feature === "YEARS_EMPLOYED") return score > 0 ? "Employment history is unstable or short." : "Good employment stability detected.";
    if (feature === "AGE_YEARS") return "Applicant age falls within a higher-risk demographic.";
    if (feature === "AMT_CREDIT") return "Requested loan amount is significantly higher than average.";
    if (feature === "AMT_INCOME_TOTAL") return "Income level is borderline for this loan size.";
    if (feature === "CODE_GENDER") return "Demographic statistical adjustment.";
    return "This factor contributed to the risk decision.";
};

export const RiskChart = ({ factors }: Props) => {
    if (!factors || factors.length === 0) return null;

    return (
        <Box mt={6} p={6} bg="gray.800" borderRadius="md" border="1px solid" borderColor="gray.700">
            <Heading size="sm" mb={2} color="gray.300" textTransform="uppercase" letterSpacing="wide">
                AI Decision Logic
            </Heading>

            {/* The Graph */}
            <Box height="250px" width="100%" mb={6}>
                <ResponsiveContainer>
                    <BarChart data={factors} layout="vertical" margin={{ left: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="feature" type="category" width={140} tick={{ fill: '#A0AEC0', fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#171923', border: 'none' }} itemStyle={{ color: 'white' }} />
                        <Bar dataKey="shap_score" radius={[0, 4, 4, 0]} barSize={20}>
                            {factors.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.shap_score > 0 ? "#E53E3E" : "#48BB78"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            <Divider borderColor="gray.600" mb={4} />

            {/* The Explanation in Text */}
            <VStack align="start" spacing={3}>
                <Heading size="xs" color="brand.500">KEY RISK DRIVERS:</Heading>
                {factors.map((f, i) => (
                    <Text key={i} fontSize="sm" color="gray.400">
                        <span style={{ color: 'white', fontWeight: 'bold' }}>{f.feature}:</span> {getExplanation(f.feature, f.shap_score)}
                    </Text>
                ))}
            </VStack>
        </Box>
    );
};