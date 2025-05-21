"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import withAdminAuth from "@/components/auth/withAdminAuth";
import type { AdminPageProps } from "@/types/admin";
import type { SiteSetting } from "@/types/siteSettingsAdmin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Asumiendo que tienes este componente
import { Label } from "@/components/ui/label"; // Asumiendo que tienes este componente
import { ArrowLeft, Save } from "lucide-react";

// Lista predefinida de configuraciones que esperamos gestionar
// El admin las creará/actualizará en la BD a través de la UI.
const PREDEFINED_SETTINGS_META: Array<
  Omit<SiteSetting, "id" | "value" | "created_at" | "updated_at"> & {
    placeholder?: string;
  }
> = [
  {
    key: "siteName",
    label: "Site Name",
    type: "text",
    group: "General",
    placeholder: "Codedex",
  },
  {
    key: "siteLogoUrl",
    label: "Site Logo URL",
    type: "text",
    group: "Appearance",
    placeholder: "/images/logos/codedex-logo.svg",
  },
  {
    key: "contactEmail",
    label: "Contact Email",
    type: "email",
    group: "General",
    placeholder: "contact@example.com",
  },
  {
    key: "defaultCourseSlug",
    label: "Default Course Slug (for homepage redirects)",
    type: "text",
    group: "Navigation",
    placeholder: "python-basics",
  },
  {
    key: "maintenanceMode",
    label: "Maintenance Mode",
    type: "boolean",
    group: "Advanced",
  },
];

const AdminSiteSettingsPage: React.FC<AdminPageProps> = ({
  user: _adminUser,
}) => {
  const [settings, setSettings] = useState<Record<string, string>>({}); // Almacenar como { key: value }
  const [_dbSettings, setDbSettings] = useState<SiteSetting[]>([]); // Para tener metadatos como label, type
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/settings");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch settings");
      }
      const data: SiteSetting[] = await response.json();
      setDbSettings(data);
      // Poblar el estado `settings` con valores de la BD, usando predefinidos como base
      const initialSettings: Record<string, string> = {};
      for (const meta of PREDEFINED_SETTINGS_META) {
        const dbVal = data.find((s) => s.key === meta.key)?.value;
        initialSettings[meta.key] =
          dbVal !== undefined ? dbVal : meta.type === "boolean" ? "false" : "";
      }
      setSettings(initialSettings);
    } catch (err: unknown) {
      setError((err as Error).message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: String(value) }));
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    // Convertir el objeto `settings` de nuevo a un array para la API
    const settingsPayload: Array<Partial<SiteSetting>> =
      PREDEFINED_SETTINGS_META.map((meta) => ({
        key: meta.key,
        value: settings[meta.key] || (meta.type === "boolean" ? "false" : ""), // Asegurar que el valor se envía
        label: meta.label,
        type: meta.type,
        group: meta.group,
      }));

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsPayload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save settings");
      }
      // Actualizar dbSettings y settings con la respuesta para reflejar cualquier cambio (ej. created_at)
      setDbSettings(data);
      const updatedSettingsState: Record<string, string> = {};
      for (const meta of PREDEFINED_SETTINGS_META) {
        const dbVal = data.find((s: SiteSetting) => s.key === meta.key)?.value;
        updatedSettingsState[meta.key] =
          dbVal !== undefined ? dbVal : meta.type === "boolean" ? "false" : "";
      }
      setSettings(updatedSettingsState);
      setSuccessMessage("Settings saved successfully!");
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSettingInput = (
    meta: Omit<SiteSetting, "id" | "value" | "created_at" | "updated_at"> & {
      placeholder?: string;
    },
  ) => {
    const currentValue =
      settings[meta.key] || (meta.type === "boolean" ? "false" : "");
    switch (meta.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={meta.key}
              checked={currentValue === "true"}
              onCheckedChange={(checked) =>
                handleInputChange(meta.key, checked)
              }
            />
            <Label
              htmlFor={meta.key}
              className="text-sm text-gray-400 cursor-pointer"
            >
              {currentValue === "true" ? "Enabled" : "Disabled"}
            </Label>
          </div>
        );
      case "textarea": // Aunque no hay en PREDEFINED_SETTINGS_META, lo dejamos por si acaso
        return (
          <Textarea
            id={meta.key}
            value={currentValue}
            onChange={(e) => handleInputChange(meta.key, e.target.value)}
            rows={3}
            className="bg-codedex-darkNavy border-gray-700"
            placeholder={meta.placeholder}
          />
        );
      case "email":
        return (
          <Input
            id={meta.key}
            type="email"
            value={currentValue}
            onChange={(e) => handleInputChange(meta.key, e.target.value)}
            className="bg-codedex-darkNavy border-gray-700"
            placeholder={meta.placeholder}
          />
        );
      default: // text, number (Input type=number)
        return (
          <Input
            id={meta.key}
            type={meta.type === "number" ? "number" : "text"}
            value={currentValue}
            onChange={(e) => handleInputChange(meta.key, e.target.value)}
            className="bg-codedex-darkNavy border-gray-700"
            placeholder={meta.placeholder}
          />
        );
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-codedex-darkNavy flex items-center justify-center text-white text-xl">
        Loading settings...
      </div>
    );

  const groupedSettings = PREDEFINED_SETTINGS_META.reduce(
    (acc, settingMeta) => {
      const group = settingMeta.group || "Other";
      if (!acc[group]) acc[group] = [];
      acc[group].push(settingMeta);
      return acc;
    },
    {} as Record<
      string,
      Array<
        Omit<SiteSetting, "id" | "value" | "created_at" | "updated_at"> & {
          placeholder?: string;
        }
      >
    >,
  );

  return (
    <div className="min-h-screen bg-codedex-darkNavy text-white p-8">
      <div className="codedex-container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-pixel text-codedex-gold">
            Site Settings
          </h1>
          <Button
            variant="outline"
            className="border-codedex-teal text-codedex-teal hover:bg-codedex-teal/10"
            asChild
          >
            <Link href="/admin/dashboard">
              <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>
          </Button>
        </div>

        {error && (
          <p className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-md text-sm">
            Error: {error}
          </p>
        )}
        {successMessage && (
          <p className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-md text-sm">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {Object.entries(groupedSettings).map(([groupName, settingMetas]) => (
            <div
              key={groupName}
              className="bg-codedex-navy p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold text-codedex-teal mb-4 border-b border-codedex-teal/20 pb-2">
                {groupName}
              </h2>
              <div className="space-y-4">
                {settingMetas.map((meta) => (
                  <div key={meta.key}>
                    <Label
                      htmlFor={meta.key}
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      {meta.label || meta.key}
                    </Label>
                    {renderSettingInput(meta)}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-codedex-teal hover:bg-codedex-teal/80"
            >
              <Save size={16} className="mr-2" />{" "}
              {isSaving ? "Saving Settings..." : "Save All Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminSiteSettingsPage);
