import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
    it('renders the logo text', () => {
        render(<Header />);
        expect(screen.getByText('WAYFWRD')).toBeInTheDocument();
    });

    it('renders navigation links on desktop', () => {
        render(<Header />);
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Courses')).toBeInTheDocument();
    });

    it('toggles mobile menu when button is clicked', () => {
        render(<Header />);
        // Initial state: mobile menu hidden (not testing css visibility directly easily with jsdom without mock, 
        // but we can check if the button exists and interaction works if we rendered the mobile menu conditionally)

        // In our implementation, mobile menu is conditionally rendered {isOpen && ...}

        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);

        // Now mobile menu links should be present/visible structure
        // Since we reuse the same text for desktop/mobile, getAllByText might return multiple
        const homeLinks = screen.getAllByText('Home');
        expect(homeLinks.length).toBeGreaterThan(1); // One desktop, one mobile
    });
});
