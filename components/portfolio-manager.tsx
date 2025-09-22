"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePortfolioStorage } from "@/hooks/use-portfolio-storage"
import type { Portfolio } from "@/types/portfolio"
import { Plus, FolderOpen, MoreVertical, Edit, Trash2, Save, Calendar, DollarSign, PieChart, Copy } from "lucide-react"

interface PortfolioManagerProps {
  onPortfolioSelect?: (portfolio: Portfolio) => void
}

export function PortfolioManager({ onPortfolioSelect }: PortfolioManagerProps) {
  const {
    portfolios,
    currentPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    loadPortfolio,
    getPortfolioSummaries,
  } = usePortfolioStorage()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null)
  const [newPortfolioName, setNewPortfolioName] = useState("")
  const [newPortfolioDescription, setNewPortfolioDescription] = useState("")

  const handleCreatePortfolio = () => {
    if (newPortfolioName.trim()) {
      const portfolio = createPortfolio(newPortfolioName.trim(), newPortfolioDescription.trim() || undefined)
      onPortfolioSelect?.(portfolio)
      setNewPortfolioName("")
      setNewPortfolioDescription("")
      setIsCreateDialogOpen(false)
    }
  }

  const handleEditPortfolio = () => {
    if (editingPortfolio && newPortfolioName.trim()) {
      updatePortfolio(editingPortfolio.id, {
        name: newPortfolioName.trim(),
        description: newPortfolioDescription.trim() || undefined,
      })
      setIsEditDialogOpen(false)
      setEditingPortfolio(null)
      setNewPortfolioName("")
      setNewPortfolioDescription("")
    }
  }

  const handleDeletePortfolio = (portfolioId: string) => {
    if (confirm("Are you sure you want to delete this portfolio? This action cannot be undone.")) {
      deletePortfolio(portfolioId)
    }
  }

  const handleDuplicatePortfolio = (portfolio: Portfolio) => {
    const duplicatedPortfolio = createPortfolio(`${portfolio.name} (Copy)`, portfolio.description)
    updatePortfolio(duplicatedPortfolio.id, {
      totalAmount: portfolio.totalAmount,
      assets: [...portfolio.assets],
    })
  }

  const openEditDialog = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio)
    setNewPortfolioName(portfolio.name)
    setNewPortfolioDescription(portfolio.description || "")
    setIsEditDialogOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const summaries = getPortfolioSummaries()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Portfolio Manager</h2>
          <p className="text-muted-foreground">Save and manage your dividend portfolios</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
              <DialogDescription>Give your portfolio a name and optional description.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Portfolio Name</label>
                <Input
                  placeholder="My Dividend Portfolio"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  placeholder="High-yield dividend stocks and ETFs for retirement income..."
                  value={newPortfolioDescription}
                  onChange={(e) => setNewPortfolioDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePortfolio} disabled={!newPortfolioName.trim()}>
                Create Portfolio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Portfolio */}
      {currentPortfolio && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-primary">Current Portfolio</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">{currentPortfolio.name}</h3>
                {currentPortfolio.description && (
                  <p className="text-sm text-muted-foreground">{currentPortfolio.description}</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Amount</div>
                  <div className="font-medium">{formatCurrency(currentPortfolio.totalAmount)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Assets</div>
                  <div className="font-medium">{currentPortfolio.assets.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Updated</div>
                  <div className="font-medium">{formatDate(currentPortfolio.updatedAt)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Saved Portfolios ({summaries.length})</h3>

        {summaries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <PieChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Portfolios Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first portfolio to start tracking dividend income
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Portfolio
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {summaries.map((summary) => (
              <Card
                key={summary.id}
                className={`hover:shadow-md transition-shadow ${
                  currentPortfolio?.id === summary.id ? "border-primary/20 bg-primary/5" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 min-w-0 flex-1">
                      <CardTitle className="text-base truncate">{summary.name}</CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(summary.updatedAt)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => loadPortfolio(summary.id)}>
                          <FolderOpen className="mr-2 h-4 w-4" />
                          Load Portfolio
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const portfolio = portfolios.find((p) => p.id === summary.id)
                            if (portfolio) openEditDialog(portfolio)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const portfolio = portfolios.find((p) => p.id === summary.id)
                            if (portfolio) handleDuplicatePortfolio(portfolio)
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeletePortfolio(summary.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-muted-foreground">Amount</div>
                        <div className="font-medium flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(summary.totalAmount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Assets</div>
                        <div className="font-medium">{summary.assetCount}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => {
                        loadPortfolio(summary.id)
                        const portfolio = portfolios.find((p) => p.id === summary.id)
                        if (portfolio) onPortfolioSelect?.(portfolio)
                      }}
                    >
                      {currentPortfolio?.id === summary.id ? (
                        <>
                          <Save className="mr-2 h-3 w-3" />
                          Current Portfolio
                        </>
                      ) : (
                        <>
                          <FolderOpen className="mr-2 h-3 w-3" />
                          Load Portfolio
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Portfolio Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Portfolio</DialogTitle>
            <DialogDescription>Update your portfolio name and description.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Portfolio Name</label>
              <Input
                placeholder="My Dividend Portfolio"
                value={newPortfolioName}
                onChange={(e) => setNewPortfolioName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                placeholder="High-yield dividend stocks and ETFs for retirement income..."
                value={newPortfolioDescription}
                onChange={(e) => setNewPortfolioDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPortfolio} disabled={!newPortfolioName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
