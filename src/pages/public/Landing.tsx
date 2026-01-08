import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Stack,
} from '@mui/material';
import {
  Gavel as GavelIcon,
  Assignment as AssignmentIcon,
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const features = [
  {
    icon: <GavelIcon sx={{ fontSize: 48 }} />,
    titleKey: 'caseManagement',
    descKey: 'caseManagementDesc',
  },
  {
    icon: <AssignmentIcon sx={{ fontSize: 48 }} />,
    titleKey: 'taskAutomation',
    descKey: 'taskAutomationDesc',
  },
  {
    icon: <TimerIcon sx={{ fontSize: 48 }} />,
    titleKey: 'timeTracking',
    descKey: 'timeTrackingDesc',
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 48 }} />,
    titleKey: 'reports',
    descKey: 'reportsDesc',
  },
];

const testimonials = [
  {
    quote: 'Neostella has transformed how we manage our cases. We\'ve increased efficiency by 40%.',
    author: 'John Smith',
    role: 'Managing Partner, Smith & Associates',
  },
  {
    quote: 'The best case management software we\'ve ever used. Simple yet powerful.',
    author: 'Maria Garcia',
    role: 'Senior Attorney, Garcia Law Firm',
  },
];

export function Landing() {
  const { t } = useTranslation();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}>
            Neostella
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button component={RouterLink} to="/login" color="primary">
              Sign In
            </Button>
            <Button component={RouterLink} to="/register" variant="contained" color="primary">
              Get Started
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h2" fontWeight={700} gutterBottom>
                Legal Case Management Made Simple
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Streamline your legal practice with our comprehensive case management solution.
                Track cases, manage deadlines, and boost productivity.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <GavelIcon sx={{ fontSize: 120, opacity: 0.8 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h3" align="center" fontWeight={700} gutterBottom>
          Everything You Need
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Powerful features designed specifically for legal professionals
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {feature.titleKey === 'caseManagement' && 'Case Management'}
                    {feature.titleKey === 'taskAutomation' && 'Task Automation'}
                    {feature.titleKey === 'timeTracking' && 'Time Tracking'}
                    {feature.titleKey === 'reports' && 'Analytics & Reports'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.titleKey === 'caseManagement' &&
                      'Manage all your cases from intake to resolution in one place.'}
                    {feature.titleKey === 'taskAutomation' &&
                      'Automate workflows and never miss a deadline.'}
                    {feature.titleKey === 'timeTracking' &&
                      'Track billable hours with precision and ease.'}
                    {feature.titleKey === 'reports' &&
                      'Get insights into your practice with powerful reports.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.100', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Why Choose Neostella?
              </Typography>
              <Stack spacing={2}>
                {[
                  'Intuitive interface designed for legal professionals',
                  'Secure data storage with role-based access',
                  'Real-time collaboration across your team',
                  'Automated deadline tracking and reminders',
                  'Comprehensive time tracking and billing',
                ].map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="primary" />
                    <Typography>{benefit}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: 4,
                  p: 4,
                  boxShadow: 3,
                }}
              >
                <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                  Demo Access
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Try our demo with pre-loaded data to explore all features:
                </Typography>
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, fontFamily: 'monospace' }}>
                  <Typography variant="body2">
                    <strong>Admin:</strong> admin@garcialaw.com / admin123
                  </Typography>
                  <Typography variant="body2">
                    <strong>Attorney:</strong> carlos@garcialaw.com / abogado123
                  </Typography>
                  <Typography variant="body2">
                    <strong>Paralegal:</strong> maria@garcialaw.com / paralegal123
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h3" align="center" fontWeight={700} gutterBottom>
          What Our Users Say
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {testimonials.map((testimonial, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontStyle: 'italic', mb: 2, fontSize: '1.1rem' }}
                  >
                    "{testimonial.quote}"
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {testimonial.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Ready to Transform Your Practice?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of legal professionals who trust Neostella.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 6,
              py: 1.5,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'grey.400', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" color="white" gutterBottom>
                Neostella
              </Typography>
              <Typography variant="body2">
                Professional case management software for modern legal practices.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" color="white" gutterBottom>
                Product
              </Typography>
              <Typography variant="body2">Features</Typography>
              <Typography variant="body2">Pricing</Typography>
              <Typography variant="body2">Security</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" color="white" gutterBottom>
                Company
              </Typography>
              <Typography variant="body2">About</Typography>
              <Typography variant="body2">Contact</Typography>
              <Typography variant="body2">Careers</Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" align="center" sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'grey.800' }}>
            © 2024 Neostella. All rights reserved. | Demo Application
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;
