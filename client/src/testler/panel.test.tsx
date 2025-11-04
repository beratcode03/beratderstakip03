/**
 * BERAT CANKIR - YKS ANALİZ TAKİP SİSTEMİ
 * @author Berat Cankır
 * @copyright © 2025 Berat Cankır. Tüm hakları saklıdır.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '../bilesenler/tema-saglayici'
import Panel from '../sayfalar/panel'

// Mock the recharts library to avoid rendering issues in tests
vi.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  RadarChart: ({ children }: any) => <div data-testid="radar-chart">{children}</div>,
  PolarGrid: () => <div data-testid="polar-grid" />,
  PolarAngleAxis: () => <div data-testid="polar-angle-axis" />,
  PolarRadiusAxis: () => <div data-testid="polar-radius-axis" />,
  Radar: () => <div data-testid="radar" />,
  ReferenceLine: () => <div data-testid="reference-line" />
}))

// Create a fresh query client for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient()
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    </ThemeProvider>
  )
}

describe('Panel Component', () => {
  beforeEach(() => {
    // Mock fetch for API calls
    global.fetch = vi.fn()
  })

  it('ana panel bileşeni render olmalı', async () => {
    // Mock empty responses
    ;(global.fetch as any).mockImplementation((url: string) => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    })

    renderWithQueryClient(<Panel />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/yükleniyor/i)).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('deneme ekleme butonu görünür olmalı', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([])
    })

    renderWithQueryClient(<Panel />)
    
    await waitFor(() => {
      const addButton = screen.queryByTestId('button-add-exam')
      expect(addButton).toBeInTheDocument()
    })
  })

  it('görev ekleme butonu görünür olmalı', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([])
    })

    renderWithQueryClient(<Panel />)
    
    await waitFor(() => {
      const addButton = screen.queryByTestId('button-add-task')
      expect(addButton).toBeInTheDocument()
    })
  })
})

describe('Panel - Data Display', () => {
  it('deneme sonuçları listelenmeli', async () => {
    const mockExams = [
      {
        id: '1',
        exam_name: 'TYT Deneme 1',
        display_name: 'İlk Denemem',
        exam_date: '2025-10-30',
        exam_type: 'TYT',
        exam_scope: 'full',
        tyt_net: '85.5',
        ayt_net: '0',
        createdAt: new Date().toISOString()
      }
    ]

    ;(global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/api/exam-results')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockExams)
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    })

    renderWithQueryClient(<Panel />)
    
    await waitFor(() => {
      expect(screen.getByText('İlk Denemem')).toBeInTheDocument()
    })
  })

  it('görevler listelenmeli', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Matematik Çalış',
        priority: 'high',
        category: 'matematik',
        completed: false,
        archived: false,
        deleted: false,
        createdAt: new Date().toISOString()
      }
    ]

    ;(global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/api/tasks')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTasks)
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    })

    renderWithQueryClient(<Panel />)
    
    await waitFor(() => {
      expect(screen.getByText('Matematik Çalış')).toBeInTheDocument()
    })
  })
})

// CANKIR