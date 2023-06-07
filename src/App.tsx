import { Box, Transition, createStyles, Navbar, Group, Code, getStylesRef, rem, Image, Center, Button, Text, ChevronIcon, Collapse, UnstyledButton, ThemeIcon, ScrollArea, Divider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Route, Routes, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Profiles from './pages/profiles';
import Dispatch from './pages/dispatch';
import { IconLayoutDashboard, IconUserCircle, IconBuildingBank, IconSlice, IconVideo, IconCar, IconScript, IconFileDescription, IconBriefcase, IconZoomExclamation, IconMap2, IconUsers, IconPointFilled, IconBuildingSkyscraper, IconChartHistogram, IconSettings, IconChevronRight, IconChevronLeft, IconCode, IconFileEuro, IconDotsVertical } from '@tabler/icons-react';
import LSPDLogo from './assets/lspd.png';
import { useNuiEvent } from './hooks/useNuiEvent';
import { AlertData, IncidentData, OfficerData, ProfileData, UnitData } from './typings';
import { useStoreOfficers } from './store/officersStore';
import { useStoreDispatch } from './store/dispatchStore';
import { useStoreUnit } from './store/unitStore';
import { useStorePersonal } from './store/personalInfoStore';
import { AnnouncementData, useStoreAnnouncements } from './store/announcementsStore';
import { useStoreProfiles } from './store/profilesStore';
import Incidents from './pages/incidents';
import { useStoreIncidents } from './store/incidentsStore';
import PenalCodes from './pages/penalcodes';

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      borderRadius: theme.radius.sm,
      background: 'linear-gradient(90deg, rgba(51,124,255,0.5) 0%, rgba(187,187,187,0) 100%)',
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  main: {
    backgroundColor: theme.colors.dark[8],
    borderRadius: theme.radius.sm,
    display: 'flex',
  },

  header: {
    marginTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.xs})`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.xs,
    color: theme.colors.gray[2],
    padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
    fontWeight: 500,

    '&:hover': {
      borderRadius: theme.radius.sm,
      background: 'linear-gradient(90deg, rgba(51,124,255,0.5) 0%, rgba(187,187,187,0) 100%)',
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      borderRadius: theme.radius.sm,
      background: 'linear-gradient(90deg, rgba(51,124,255,0.5) 0%, rgba(187,187,187,0) 100%)',
      [`& .${getStylesRef('icon')}`]: {
        color: 'white',
      },
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },
}));

interface SetupMdtData {
  alerts?: AlertData[];
  officers: OfficerData[];
  units?: UnitData[];
  personalInformation: OfficerData;
  announcements: AnnouncementData[];
  profiles: ProfileData[];
  incidents: IncidentData[];
}

const homeData = [
  {link: '', label: 'Dashboard', icon: IconLayoutDashboard},
]

const pagesData = [
  {link: 'profiles', label: 'Profiles', icon: IconUserCircle},
  {link: 'incidents', label: 'Incidents', icon: IconScript},
  {link: 'reports', label: 'Reports', icon: IconFileDescription},
  {link: 'dispatch', label: 'Dispatch', icon: IconMap2},
  {link: 'boloWarrants', label: 'Bolos & Warrants', icon: IconZoomExclamation},
  {link: 'vehicles', label: 'Vehicles', icon: IconCar},
  {link: 'evidence', label: 'Evidence', icon: IconBriefcase},
  {
    links: [
      { link: 'businesses', label: 'Businesses', icon: IconBuildingBank },
      { link: 'properties', label: 'Propterties', icon: IconBuildingSkyscraper },
      { link: 'cameras', label: 'Cameras', icon: IconVideo },
      { link: 'weaponRegistry', label: 'Weapon Registery', icon: IconSlice },
      { label: 'Penal Codes', link: 'penalcodes', icon: IconFileEuro },
    ], 
    label: 'Others', 
    icon: IconPointFilled
  },
]

const staffData = [
  { label: 'Roster', link: 'roster', icon: IconUsers }, 
  { label: '10 codes / commands', link: '10Codes', icon: IconCode },
  { label: 'Statistics', link: 'statistics', icon: IconChartHistogram },
]


function App() {
  const { classes, cx, theme } = useStyles();
  const [visible, setVisible] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();
  const { setOfficers } = useStoreOfficers();
  const { setAlerts } = useStoreDispatch();
  const { setUnits } = useStoreUnit();
  const { setPersonalData, firstname, lastname, callsign, role } = useStorePersonal();
  const { setAnnouncements } = useStoreAnnouncements();
  const { setProfiles } = useStoreProfiles();
  const { setIncidents } = useStoreIncidents();
  const [opened, setOpened] = useState(false);
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;

  useNuiEvent<SetupMdtData>('setupMdt', (data) => {
    setOfficers(data.officers);
    if (data.alerts !== undefined) setAlerts(data.alerts);
    if (data.units !== undefined) setUnits(data.units);
    setPersonalData(data.personalInformation);
    setAnnouncements(data.announcements);
    setProfiles(data.profiles);
    setIncidents(data.incidents);
  });

  useEffect(() => {
    setActiveLink(location.pathname.split('/')[1]);
  }, [location]);

  const homeLinks = homeData.map((item) => (
    <NavLink
      key={item.label}
      to={`/${item.link}`}
      onClick={() => {
        setActiveLink(item.link);
      }}
      className={cx(classes.link, {[classes.linkActive]: activeLink === item.link})}
    >
      <item.icon className={classes.linkIcon} stroke={1.5}/>
      <span>{item.label}</span>
    </NavLink>
  ));

  const pagesLinks = pagesData.map((item) => (
		<>
			{item.links === undefined ? (
				<NavLink
					key={item.link}
					to={`/${item.link}`}
					onClick={() => {
						setActiveLink(item.link);
					}}
					className={cx(classes.link, {
						[classes.linkActive]: activeLink === item.link,
					})}
				>
					<item.icon className={classes.linkIcon} stroke={1.5} />
					<span>{item.label}</span>
				</NavLink>
			) : (
				<>
					<UnstyledButton
						onClick={() => setOpened((o) => !o)}
						className={classes.control}
					>
						<Group position='apart' spacing={0}>
							<Box sx={{ display: "flex", alignItems: "center" }}>
								<item.icon className={classes.linkIcon} stroke={1.5} />
								<span>{item.label}</span>
							</Box>
							{item.links && (
								<ChevronIcon
									className={classes.chevron}
									size='1rem'
									stroke={1.5}
									style={{
										transform: opened
											? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
											: "none",
									}}
								/>
							)}
						</Group>
					</UnstyledButton>
					{item.links ? (
						<Collapse in={opened}>
							{item.links.map((link) => (
								<NavLink
									key={link.label}
									to={`/${link.link}`}
									onClick={() => {
										setActiveLink(link.link);
									}}
									className={cx(classes.link, {
										[classes.linkActive]: activeLink === link.link,
									})}
									style={{
										marginLeft: rem(20),
										paddingLeft: rem(20),
										padding: `${theme.spacing.xs} ${theme.spacing.md}`,
										borderLeft: `${rem(1)} solid ${
											theme.colorScheme === "dark"
												? theme.colors.dark[4]
												: theme.colors.gray[3]
										}`,
									}}
								>
									<link.icon className={classes.linkIcon} stroke={1.5} />
									<span>{link.label}</span>
								</NavLink>
							))}
						</Collapse>
					) : null}
				</>
			)}
		</>
	));

  const staffLinks = staffData.map((item) => (
    <NavLink
      key={item.label}
      to={`/${item.link}`}
      onClick={() => {
        setActiveLink(item.link);
      }}
      className={cx(classes.link, {[classes.linkActive]: activeLink === item.link})}
    >
      <item.icon className={classes.linkIcon} stroke={1.5}/>
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <div className={classes.container}>
      <Transition transition='slide-up' mounted={visible}>
        {(style) => (
          <div style={{...style, display: 'flex', width: '100%', margin: 50, height: '95%'}}>
            <div>
              <Navbar height={"100%"} width={{ sm: 300 }} p='xs' style={{backgroundColor: '#242527', borderTopLeftRadius: 5, borderBottomLeftRadius: 5}}>
                <Navbar.Section grow>
                  <Center>
                    <Image radius={"md"} width={150} height={150} src={LSPDLogo} alt='LSPD Logo' />
                  </Center>
                  <Divider my="sm" />
                  <ScrollArea h={650} scrollbarSize={2}>
                    <Text size="xs" weight={500} color="dimmed" style={{margin: 8}}>
                      Home
                    </Text>
                    {homeLinks}
                    <Text size="xs" weight={500} color="dimmed" style={{margin: 8}}>
                      Pages
                    </Text>
                    {pagesLinks}
                    <Text size="xs" weight={500} color="dimmed" style={{margin: 8}}>
                      Staff
                    </Text>
                    {staffLinks}
                  </ScrollArea>
                </Navbar.Section>
                <Box sx={{paddingTop: 5, borderTop: `${rem(1)} solid ${ theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`}}>
                  <UnstyledButton
                    sx={{
                      display: 'block',
                      width: '100%',
                      padding: theme.spacing.xs,
                      borderRadius: theme.radius.sm,
                      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                      '&:hover': {
                        backgroundColor:
                          theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                      },
                    }}
                  >
                    <Group>
                      <Box sx={{ flex: 1 }}>
                        <Text size="sm" weight={500}>
                          {firstname} {lastname}
                        </Text>
                        <Text color="dimmed" size="xs">
                          {role} | {callsign}
                        </Text>
                      </Box>

                      <IconDotsVertical size={rem(18)} />
                    </Group>
                  </UnstyledButton>
                </Box>
              </Navbar>
            </div>

            <div style={{backgroundColor: '#1c1d1f', width: 1520, borderTopRightRadius: 5, borderBottomRightRadius: 5}}>
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path="/profiles" element={<Profiles />} />
                <Route path="/incidents" element={<Incidents />} />
                <Route path="/dispatch" element={<Dispatch />} />
                <Route path="/penalcodes" element={<PenalCodes />} />
              </Routes>
            </div>
          </div>
        )}
      </Transition>
      {!visible &&
        <Button style={{color: 'black'}} variant="default" onClick={() => { setVisible(true) }}>Open</Button>
      }
    </div>
	);
}

export default App
