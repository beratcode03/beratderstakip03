// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { Switch, Route } from "wouter";
import { sorguIstemcisi } from "./kutuphane/sorguIstemcisi";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/bilesenler/arayuz/toaster";
import { TooltipProvider } from "@/bilesenler/arayuz/tooltip";
import { ThemeProvider } from "@/bilesenler/tema-saglayici";
import Homepage from "@/sayfalar/anasayfa-detay";
import Home from "@/sayfalar/anasayfa";
import Dashboard from "@/sayfalar/panel";
import NetCalculator from "@/sayfalar/net-hesaplayici";
import Timer from "@/sayfalar/sayac";
import YKSKonular from "@/sayfalar/yks-konular";
import NotFound from "@/sayfalar/bulunamadi";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Homepage} />
      <Route path="/tasks" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/net-calculator" component={NetCalculator} />
      <Route path="/timer" component={Timer} />
      <Route path="/yks-konular" component={YKSKonular} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={sorguIstemcisi}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
