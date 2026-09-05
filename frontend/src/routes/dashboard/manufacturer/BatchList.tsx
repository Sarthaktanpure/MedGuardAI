import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableSkeleton } from "../../../components/ui/Table";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../components/ui/Toast";
import { Batch } from "../../../../shared/types";
import { ShieldAlert, RefreshCw, FileText, QrCode, Printer, Download, Maximize2, Minimize2, Copy, Check, ExternalLink } from "lucide-react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/Dialog";
import { cn } from "../../../lib/utils/cn";


export default function BatchList() {
  const queryClient = useQueryClient();

  const [selectedBatchForQR, setSelectedBatchForQR] = React.useState<Batch | null>(null);
  const [isEnlarged, setIsEnlarged] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [qrFormat, setQrFormat] = React.useState<"url" | "json">("url");
  const [qrDetails, setQrDetails] = React.useState({
    name: "Paracetamol 500mg",
    mfr: "Pfizer Dublin Facility",
    mfgDate: new Date().toISOString().split("T")[0],
    expDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    ingredients: "Paracetamol Active Compound",
    dosage: "500mg"
  });
  const [compiledQRData, setCompiledQRData] = React.useState<string | null>(null);

  const handleOpenQRModal = (batch: Batch) => {
    setSelectedBatchForQR(batch);
    setCompiledQRData(null);
    setIsEnlarged(false);
    setCopied(false);
    setQrFormat("url");
    setQrDetails({
      name: "Paracetamol 500mg",
      mfr: "Pfizer Dublin Facility",
      mfgDate: new Date(batch.createdAt).toISOString().split("T")[0],
      expDate: new Date(new Date(batch.createdAt).getTime() + 730 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      ingredients: "Paracetamol Active Compound",
      dosage: "500mg"
    });
  };

  const qrValueToRender = React.useMemo(() => {
    if (!selectedBatchForQR || !compiledQRData) return "";
    if (qrFormat === "url") {
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
      const params = new URLSearchParams({
        key: selectedBatchForQR.batchKey,
        name: qrDetails.name,
        mfr: qrDetails.mfr,
        mfg: qrDetails.mfgDate,
        exp: qrDetails.expDate,
        ing: `${qrDetails.ingredients} (${qrDetails.dosage})`,
        tx: selectedBatchForQR.chainTxHash || ""
      });
      return `${origin}/verify#/qr?${params.toString()}`;
    }
    return compiledQRData;
  }, [selectedBatchForQR, compiledQRData, qrFormat, qrDetails]);

  const handleDownloadQR = () => {
    const canvas = document.getElementById("qr-export-canvas") as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `MedGuard-${selectedBatchForQR?.batchKey || "tag"}-HD-QR.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Crystal clear 1024x1024 QR PNG downloaded.", "HD QR Downloaded");
    } else {
      toast.error("Could not export QR code canvas.", "Download Failed");
    }
  };

  const handleCopyPayload = async () => {
    const textToCopy = qrValueToRender || compiledQRData;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success(qrFormat === "url" ? "Verification URL copied to clipboard." : "QR JSON copied to clipboard.", "Copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy payload.", "Clipboard Error");
    }
  };

  const handleOpenVerifier = () => {
    if (compiledQRData) {
      sessionStorage.setItem("medguard_pending_qr", compiledQRData);
      window.open("/verify#/qr", "_blank");
      toast.success("Opening QR Verifier with current payload.", "Opening Scanner");
    }
  };

  const { data: batches, isLoading, refetch } = useQuery<Batch[]>({
    queryKey: ["batches"],
    queryFn: async () => {
      const res = await fetch("/api/v1/batches");
      if (!res.ok) throw new Error("Failed to load inventory");
      return res.json();
    },
  });

  const recallMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/batches/${id}/flag`, { method: "POST" });
      if (!res.ok) throw new Error("Recall action failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Batch successfully flagged as recalled on-chain.", "Recall Confirmed");
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
    onError: () => {
      toast.error("Failed to submit recall order.", "Recall Failed");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Batch Inventory</h1>
          <p className="text-xs text-muted-foreground">
            Monitor lot status, on-chain checksum receipts, and active recalls.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Key</TableHead>
                <TableHead>Metadata Hash</TableHead>
                <TableHead>Chain Status</TableHead>
                <TableHead>Integrity State</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-mono text-xs font-bold text-slate-300">
                    {item.batchKey}
                  </TableCell>
                  <TableCell className="font-mono text-[10px] truncate max-w-[120px]" title={item.metadataHash}>
                    {item.metadataHash}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.chainStatus === "confirmed" ? "genuine" : "suspect"}>
                      {item.chainStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.flagged ? (
                      <Badge variant="fake">RECALLED</Badge>
                    ) : (
                      <Badge variant="genuine">OK</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[10px] h-7 px-2"
                        onClick={() => handleOpenQRModal(item)}
                      >
                        <QrCode className="h-3 w-3 mr-1 text-primary" />
                        QR Code
                      </Button>
                      {!item.flagged && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-[10px] h-7 px-2"
                          isLoading={recallMutation.isPending && recallMutation.variables === item._id}
                          onClick={() => {
                            if (confirm(`Trigger emergency blockchain recall for batch ${item.batchKey}?`)) {
                              recallMutation.mutate(item._id);
                            }
                          }}
                        >
                          <ShieldAlert className="h-3 w-3 mr-1" />
                          Recall
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Product Authenticity Pass QR Dialog */}
      <Dialog open={!!selectedBatchForQR} onOpenChange={(open) => { if(!open) { setSelectedBatchForQR(null); setCompiledQRData(null); setIsEnlarged(false); } }}>
        <DialogContent className={compiledQRData && isEnlarged ? "max-w-xl bg-card border border-border rounded-2xl p-6 transition-all duration-200" : "max-w-md bg-card border border-border rounded-2xl p-6 transition-all duration-200"}>
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
              <QrCode className="h-5 w-5 text-primary animate-pulse" />
              Generate Product Authenticity Tag
            </DialogTitle>
            <DialogDescription className="text-[11px] text-muted-foreground">
              Configure manufacturing parameters to encode into the secure QR shipping signature.
            </DialogDescription>
          </DialogHeader>

          {!compiledQRData ? (
            <div className="space-y-3.5 pt-2 text-[11px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Medicine Name</label>
                  <input
                    type="text"
                    value={qrDetails.name}
                    onChange={(e) => setQrDetails({...qrDetails, name: e.target.value})}
                    className="w-full p-2 text-xs rounded-lg border bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Dosage Spec</label>
                  <input
                    type="text"
                    value={qrDetails.dosage}
                    onChange={(e) => setQrDetails({...qrDetails, dosage: e.target.value})}
                    className="w-full p-2 text-xs rounded-lg border bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">Manufacturer Facility Name</label>
                <input
                  type="text"
                  value={qrDetails.mfr}
                  onChange={(e) => setQrDetails({...qrDetails, mfr: e.target.value})}
                  className="w-full p-2 text-xs rounded-lg border bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Manufacturing Date</label>
                  <input
                    type="date"
                    value={qrDetails.mfgDate}
                    onChange={(e) => setQrDetails({...qrDetails, mfgDate: e.target.value})}
                    className="w-full p-2 text-xs rounded-lg border bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Expiration Date</label>
                  <input
                    type="date"
                    value={qrDetails.expDate}
                    onChange={(e) => setQrDetails({...qrDetails, expDate: e.target.value})}
                    className="w-full p-2 text-xs rounded-lg border bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">Active Composition Description</label>
                <input
                  type="text"
                  value={qrDetails.ingredients}
                  onChange={(e) => setQrDetails({...qrDetails, ingredients: e.target.value})}
                  className="w-full p-2 text-xs rounded-lg border bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <Button
                className="w-full text-xs font-bold mt-2"
                onClick={() => {
                  if (selectedBatchForQR) {
                    const payload = {
                      key: selectedBatchForQR.batchKey,
                      name: qrDetails.name,
                      mfr: qrDetails.mfr,
                      mfg: qrDetails.mfgDate,
                      exp: qrDetails.expDate,
                      ing: `${qrDetails.ingredients} (${qrDetails.dosage})`,
                      tx: selectedBatchForQR.chainTxHash
                    };
                    setCompiledQRData(JSON.stringify(payload));
                    toast.success("QR payload compiled successfully.", "Certificate Generated");
                  }
                }}
              >
                Compile Shipping QR Tag
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-2 space-y-4">
              {/* Format Mode Selector (Phone Web Link vs Raw JSON) */}
              <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs w-full max-w-[300px] shadow-md">
                <button
                  type="button"
                  onClick={() => setQrFormat("url")}
                  className={cn(
                    "flex-1 py-1.5 px-2.5 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1.5",
                    qrFormat === "url"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  📱 Phone Link
                </button>
                <button
                  type="button"
                  onClick={() => setQrFormat("json")}
                  className={cn(
                    "flex-1 py-1.5 px-2.5 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1.5",
                    qrFormat === "json"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  📦 Raw JSON Data
                </button>
              </div>

              {/* Hidden 1024x1024 high-resolution canvas for crystal-clear HD download */}
              <QRCodeCanvas
                id="qr-export-canvas"
                value={qrValueToRender || compiledQRData}
                size={1024}
                level="M"
                includeMargin={true}
                marginSize={4}
                style={{ display: "none" }}
              />

              {/* Tag Container */}
              <div 
                className="w-full p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 border border-slate-800 shadow-2xl space-y-4 flex flex-col items-center"
              >
                {/* Header info */}
                <div className="w-full flex justify-between items-center text-[10px] font-mono text-muted-foreground border-b border-slate-800/80 pb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    MEDGUARD SECURE TAG
                  </span>
                  <span className="text-primary font-bold tracking-wide">LOT VERIFIED</span>
                </div>

                {/* Ultra-Crisp QR Code Box */}
                <div className="p-3.5 bg-white rounded-xl shadow-2xl ring-4 ring-white/10 flex flex-col items-center justify-center">
                  <QRCodeSVG 
                    value={qrValueToRender || compiledQRData} 
                    size={isEnlarged ? 300 : 220} 
                    level="M" 
                    includeMargin={true}
                    marginSize={4}
                    style={{
                      shapeRendering: "crispEdges",
                      imageRendering: "pixelated",
                      width: isEnlarged ? "300px" : "220px",
                      height: isEnlarged ? "300px" : "220px",
                    }}
                  />
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest pt-1.5">
                    {qrFormat === "url" ? "Direct Web Link (Phone Compatible)" : "ISO-18004 Raw Payload"}
                  </span>
                </div>

                {/* Live Scanning Hint */}
                <p className="text-[11px] text-slate-300 font-medium text-center flex items-center gap-1">
                  {qrFormat === "url" 
                    ? "📱 Point phone camera to open verification link" 
                    : "⚡ Ready for MedGuard scanner or hardware reader"}
                </p>

                {/* Label stats */}
                <div className="w-full space-y-1.5 text-center text-xs">
                  <h4 className="font-extrabold text-sm tracking-tight text-white">{qrDetails.name}</h4>
                  <p className="font-mono text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-0.5 rounded-full inline-block font-semibold">
                    Batch: {selectedBatchForQR?.batchKey}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 text-left border-t border-slate-800/60">
                    <div>
                      <span className="block font-bold text-slate-300">MFG Date:</span>
                      <span>{qrDetails.mfgDate}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-300">EXP Date:</span>
                      <span className="text-amber-400 font-bold">{qrDetails.expDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="grid grid-cols-2 gap-2 w-full pt-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={() => setIsEnlarged(!isEnlarged)}
                >
                  {isEnlarged ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5 mr-1" />
                      Standard Size
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3.5 w-3.5 mr-1" />
                      Enlarge View
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={handleDownloadQR}
                >
                  <Download className="h-3.5 w-3.5 mr-1 text-primary" />
                  Save HD PNG
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={handleCopyPayload}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Payload
                    </>
                  )}
                </Button>

                <Button 
                  size="sm" 
                  className="text-xs h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  onClick={handleOpenVerifier}
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Verify Live
                </Button>
              </div>

              <div className="flex gap-2 w-full border-t border-border/40 pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 text-xs text-muted-foreground"
                  onClick={() => setCompiledQRData(null)}
                >
                  Edit Parameters
                </Button>
                <Button 
                  variant="outline"
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => {
                    window.print();
                  }}
                >
                  <Printer className="h-3.5 w-3.5 mr-1" />
                  Print Label
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
