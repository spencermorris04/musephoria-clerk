"use client";
import Link from 'next/link';
import { AppBar, Toolbar, IconButton, InputBase, Typography, Button } from '@mui/material';
import { Search as SearchIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import UploadModalComponent from './UploadModal';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserPoints } from '../app/store/slices/pointsSlice'; // Adjust the path as needed
import { RootState, AppDispatch } from '../app/store/store';
import { useSpring, animated } from 'react-spring';
import MenuIcon from '@mui/icons-material/Menu'; // Import the hamburger icon
import { createClient } from '~/util/supabase/client'; 



function classNames(...classes: Array<string | false | undefined | null>): string {
  return classes.filter(Boolean).join(' ');
}


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 1),
  },
  outline: '3px solid black',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const MobileTopNavbar = () => {
  const [user, setUser] = useState(null); // State to hold the user object
  const [open, setOpen] = useState(false);
  const [pointsDisplay, setPointsDisplay] = useState<number | string>('');
  const [lastPoints, setLastPoints] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>(); // Correctly type the dispatch

    // Fetch the user from Supabase
    useEffect(() => {
      const fetchUser = async () => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if (!error && data?.user) {
          setUser(data.user);
        }
      };
  
      fetchUser();
    }, []);

  // Get the total points from Redux store
  const totalPoints = useSelector((state: RootState) => state.points.totalPoints);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserPoints(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (totalPoints !== lastPoints) {
      setPointsDisplay(totalPoints);
      setLastPoints(totalPoints);
    }
  }, [totalPoints, lastPoints]);

  // Spring animation for the points
  const springProps = useSpring({ 
    number: totalPoints, 
    from: { number: lastPoints }
  });

  // Handle open/close for modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Modal style
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

    // State for managing menu open/close
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle the menu open/close
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
  };

    // Function to handle menu link click
    const handleMenuLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      setIsMenuOpen(false); // Close the menu
    };
  

  // Menu component with links
  const MenuComponent = () => (
    <div className={`absolute top-14 left-1 w-fit px-1 h-fit bg-black outline outline-3 rounded-lg z-50 ${!isMenuOpen && 'hidden'}`}>
    <ul className="space-y-2 p-4">
        {/* Add your menu items here */}
        <li className=""><Link href="/site">Dashboard</Link></li>
        <li><Link href="/site/SongEngine" onClick={handleMenuLinkClick}>Song Engine</Link></li>
        <li><Link href="/site/Projects" onClick={handleMenuLinkClick}>Projects</Link></li>
        <li><Link href="/site/Feedback" onClick={handleMenuLinkClick}>Feedback</Link></li>
        <li><Link href="/site/League" onClick={handleMenuLinkClick}>League</Link></li>
        <li><Link href="/site/Messages" onClick={handleMenuLinkClick}>Messages</Link></li>
        <li><Link href="/site/Settings" onClick={handleMenuLinkClick}>Settings</Link></li>
      </ul>
    </div>
  );

  return (
    <AppBar position="static">
      <Toolbar className="bg-black text-black flex justify-between">
        {/* Left-aligned items with hamburger menu */}
        <div className="flex items-center text-white">
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
          <MenuComponent /> {/* Render the MenuComponent here */}
        </div>


        {/* Right-aligned items */}
        <div className="flex items-center">
          <div className="bg-white px-2 py-2 rounded-md outline outline-3 mr-4">
            <Typography variant="body1" color="inherit" component="div">
              Points: 
              <animated.span className="font-semibold text-black">
                {springProps.number.to(n => n.toFixed(0))}
              </animated.span>
            </Typography>
          </div>

          <div className="bg-white rounded-md outline outline-3 mr-4">
            <IconButton color="inherit" aria-label="notifications">
              <NotificationsIcon />
            </IconButton>
          </div>

          <div className="bg-white px-2 rounded-md outline outline-3">
            <Button color="inherit" onClick={handleOpen}>
              Upload
            </Button>
          </div>
        </div>

        {open && <UploadModalComponent onClose={handleClose} />}
      </Toolbar>
    </AppBar>
  );
};


export default MobileTopNavbar;
