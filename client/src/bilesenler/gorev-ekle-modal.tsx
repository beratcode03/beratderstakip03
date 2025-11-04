// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/bilesenler/arayuz/dialog";
import { Button } from "@/bilesenler/arayuz/button";
import { Input } from "@/bilesenler/arayuz/input";
import { Textarea } from "@/bilesenler/arayuz/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/bilesenler/arayuz/select";
import { Label } from "@/bilesenler/arayuz/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/bilesenler/arayuz/popover";
import { Calendar } from "@/bilesenler/arayuz/calendar";
import { CalendarDays } from "lucide-react";
import { InsertTask } from "@shared/sema";
import { apiRequest, sorguIstemcisi } from "@/kutuphane/sorguIstemcisi";
import { useToast } from "@/hooks/use-toast";

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTaskModal({ open, onOpenChange }: AddTaskModalProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    category: "genel" | "turkce" | "sosyal" | "matematik" | "fizik" | "kimya" | "biyoloji" | "tyt-geometri" | "ayt-geometri" | "ayt-matematik" | "ayt-fizik" | "ayt-kimya" | "ayt-biyoloji";
    color: string;
    dueDate: string;
    recurrenceType: "none" | "weekly" | "monthly";
    recurrenceEndDate: string;
  }>({
    title: "",
    description: "",
    priority: "medium",
    category: "genel",
    color: "#8B5CF6",
    dueDate: new Date().toISOString().split('T')[0],
    recurrenceType: "none",
    recurrenceEndDate: "",
  });

  const { toast } = useToast();

  const createTaskMutation = useMutation({
    mutationFn: (data: InsertTask) => 
      apiRequest("POST", "/api/tasks", data),
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ["/api/tasks"] });
      sorguIstemcisi.invalidateQueries({ queryKey: ["/api/calendar"] });
      toast({
        title: "Görev eklendi",
        description: "Yeni görev başarıyla eklendi.",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Görev eklenemedi.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      category: "genel",
      color: "#8B5CF6",
      dueDate: new Date().toISOString().split('T')[0],
      recurrenceType: "none",
      recurrenceEndDate: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Uyarı",
        description: "Görev başlığı gereklidir.",
        variant: "destructive",
      });
      return;
    }

    createTaskMutation.mutate({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      category: formData.category,
      color: formData.color,
      dueDate: formData.dueDate,
      recurrenceType: formData.recurrenceType,
      recurrenceEndDate: formData.recurrenceType !== "none" && formData.recurrenceEndDate ? formData.recurrenceEndDate : undefined,
      completed: false,
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Yeni Görev Ekle</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Görev başlığı */}
          <div>
            <Label htmlFor="task-title">Görev Başlığı (Max 50 karakter)</Label>
            <Input
              id="task-title"
              placeholder="Görev başlığını girin..."
              value={formData.title}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 50) {
                  setFormData(prev => ({ ...prev, title: value }));
                }
              }}
              maxLength={50}
              data-testid="input-task-title"
            />
            <p className="text-xs text-muted-foreground mt-1">{formData.title.length}/50 karakter</p>
          </div>

          {/* Görev Açıklaması */}
          <div>
            <Label htmlFor="task-description">Açıklama (Max 300 karakter)</Label>
            <Textarea
              id="task-description"
              placeholder="Görev detaylarını açıklayın..."
              value={formData.description}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 300) {
                  setFormData(prev => ({ ...prev, description: value }));
                }
              }}
              maxLength={300}
              className="h-20 resize-none"
              data-testid="input-task-description"
            />
            <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/300 karakter</p>
          </div>

          {/* Görev Tarihi */}
          <div>
            <Label htmlFor="task-due-date">Görevin Bitirilme Tarihi</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  data-testid="button-task-due-date"
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('tr-TR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  }) : "Tarih seçin"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate ? new Date(formData.dueDate + 'T00:00:00') : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      setFormData(prev => ({ ...prev, dueDate: `${year}-${month}-${day}` }));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Görev Önceliği & Kategorisi */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-priority">Öncelik</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger data-testid="select-task-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Düşük</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="task-category">Ders Kategorisi</Label>
              <Select
                value={formData.category}
                onValueChange={(value: "genel" | "turkce" | "sosyal" | "matematik" | "fizik" | "kimya" | "biyoloji" | "tyt-geometri" | "ayt-geometri" | "ayt-matematik" | "ayt-fizik" | "ayt-kimya" | "ayt-biyoloji") => 
                  setFormData(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger data-testid="select-task-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="genel">Genel</SelectItem>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b">TYT Dersleri</div>
                  <SelectItem value="turkce">Türkçe</SelectItem>
                  <SelectItem value="sosyal">Sosyal Bilimler</SelectItem>
                  <SelectItem value="matematik">Matematik</SelectItem>
                  <SelectItem value="fizik">Fizik</SelectItem>
                  <SelectItem value="kimya">Kimya</SelectItem>
                  <SelectItem value="biyoloji">Biyoloji</SelectItem>
                  <SelectItem value="tyt-geometri">TYT Geometri</SelectItem>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b border-t">AYT Dersleri</div>
                  <SelectItem value="ayt-matematik">Matematik</SelectItem>
                  <SelectItem value="ayt-fizik">Fizik</SelectItem>
                  <SelectItem value="ayt-kimya">Kimya</SelectItem>
                  <SelectItem value="ayt-biyoloji">Biyoloji</SelectItem>
                  <SelectItem value="ayt-geometri">AYT Geometri</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tekrarlama Seçenekleri */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-recurrence">Tekrar</Label>
              <Select
                value={formData.recurrenceType}
                onValueChange={(value: "none" | "weekly" | "monthly") => 
                  setFormData(prev => ({ ...prev, recurrenceType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tekrarlanmaz</SelectItem>
                  <SelectItem value="weekly">Haftalık</SelectItem>
                  <SelectItem value="monthly">Aylık</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.recurrenceType !== "none" && (
              <div>
                <Label htmlFor="task-recurrence-end">Tekrarın Bitiş Tarihi</Label>
                <Input
                  id="task-recurrence-end"
                  type="date"
                  value={formData.recurrenceEndDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurrenceEndDate: e.target.value }))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Renk Seçici */}
          <div>
            <Label htmlFor="task-color">Görev Rengi</Label>
            <div className="flex items-center space-x-3">
              <Input
                id="task-color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-16 h-10 rounded cursor-pointer"
                data-testid="input-task-color"
              />
              <div className="flex space-x-2">
                {["#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-6 h-6 rounded-full border-2 ${
                      formData.color === color ? "border-gray-400" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Eylem Düğmeleri */}
          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit"
              disabled={createTaskMutation.isPending}
              className="flex-1"
              data-testid="button-save-task"
            >
              {createTaskMutation.isPending ? "Ekleniyor..." : "Görev Ekle"}
            </Button>
            <Button 
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="flex-1"
              data-testid="button-cancel-task"
            >
              İptal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
