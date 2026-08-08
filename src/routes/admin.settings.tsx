import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

type SiteSettings = {
  name: string;
  tagline: string;
  phone: string;
  phoneIntl: string;
  email: string;
  addressPrimary: string;
  addressSecondary: string;
  city: string;
  facebook: string;
  youtube: string;
};

const defaultSettings: SiteSettings = {
  name: "Al-Mustafa Academy",
  tagline: "Evening Coaching",
  phone: "0335 0555696",
  phoneIntl: "+923350555696",
  email: "almustafaschool@gmail.com",
  addressPrimary: "House# 1460 Sachal Sarmast Road, G-11/2, Islamabad",
  addressSecondary: "House 417, Sawan Road, G-10/4, Islamabad",
  city: "Islamabad, Pakistan 44000",
  facebook: "https://www.facebook.com/Almustafa614",
  youtube: "https://youtube.com/@almustafa1292",
};

function AdminSettings() {
  const { data: loadedSettings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (loadedSettings) {
      setSettings((prev) => ({ ...prev, ...loadedSettings }));
    }
  }, [loadedSettings]);

  function handleChange(field: keyof SiteSettings, value: string) {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    updateSettings.mutate(settings, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
      onError: (err) => alert(`Failed to save settings: ${err.message}`),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage site-wide configuration.</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Academy Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Academy Name</Label>
              <Input id="name" value={settings.name} onChange={(e) => handleChange("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" value={settings.tagline} onChange={(e) => handleChange("tagline", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={settings.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneIntl">International Phone</Label>
              <Input id="phoneIntl" value={settings.phoneIntl} onChange={(e) => handleChange("phoneIntl", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={settings.email} onChange={(e) => handleChange("email", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="addressPrimary">Primary Address</Label>
              <Textarea id="addressPrimary" value={settings.addressPrimary} onChange={(e) => handleChange("addressPrimary", e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressSecondary">Secondary Address</Label>
              <Textarea id="addressSecondary" value={settings.addressSecondary} onChange={(e) => handleChange("addressSecondary", e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={settings.city} onChange={(e) => handleChange("city", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input id="facebook" value={settings.facebook} onChange={(e) => handleChange("facebook", e.target.value)} placeholder="https://www.facebook.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input id="youtube" value={settings.youtube} onChange={(e) => handleChange("youtube", e.target.value)} placeholder="https://youtube.com/..." />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
