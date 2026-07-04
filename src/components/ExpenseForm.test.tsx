import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExpenseForm } from './ExpenseForm';

// Mock the security module to avoid local storage issues in tests if any
vi.mock('../security', () => ({
  addAuditLog: vi.fn(),
}));

const mockOnBack = vi.fn();

describe('ExpenseForm - E2E & Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the expense form correctly', () => {
    render(<ExpenseForm onBack={mockOnBack} />);
    expect(screen.getByText('New Expense')).toBeInTheDocument();
    expect(screen.getByText('Take Photo')).toBeInTheDocument();
  });

  it('simulates manual data entry and submission', async () => {
    render(<ExpenseForm onBack={mockOnBack} />);
    
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '25.50' } });
    
    const supplierInput = screen.getByPlaceholderText('e.g. Toolstation, BP, Screwfix');
    fireEvent.change(supplierInput, { target: { value: 'Test Supplier' } });
    
    const categorySelect = screen.getByRole('combobox', { name: /Category/i });
    fireEvent.change(categorySelect, { target: { value: 'Fuel' } });
    
    // Use submit on the form directly to bypass HTML5 standard button block in jsdom
    const form = screen.getByTestId('expense-form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(mockOnBack).toHaveBeenCalled();
    });
  });
});
