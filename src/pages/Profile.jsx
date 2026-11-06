
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import {
    UserRound,
    Building2,
    MapPin,
    FileBadge,
    ShieldCheck,
    Save,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    LoaderCircle,
    Store,
    Mail,
    Phone,
    ClipboardCheck,
    Pencil,
} from "lucide-react";

const sections = [
    { id: "personal", label: "Personal Information", icon: UserRound },
    { id: "business", label: "Business Registration", icon: Building2 },
    { id: "address", label: "Business Address", icon: MapPin },
    { id: "license", label: "License & Documents", icon: FileBadge },
    { id: "review", label: "Review & Account", icon: ShieldCheck },
];

const initialRegistration = {
    businessName: "",
    businessType: "",
    registrationNumber: "",
    licenseNumber: "",
    gstin: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
};

const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

function Field({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    hint = "",
}) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClass}
            />
            {hint && (
                <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
            )}
        </div>
    );
}

function SelectField({ label, value, onChange, options }) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <select
                value={value}
                onChange={onChange}
                className={inputClass}
            >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

function SectionHeading({ title, description }) {
    return (
        <div className="mb-7">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
            </p>
        </div>
    );
}

function DetailCard({ label, value, icon: Icon }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                {Icon && <Icon size={16} className="text-emerald-600" />}
                {label}
            </div>
            <p className="mt-2 break-words font-semibold text-gray-900">
                {value || "Not provided"}
            </p>
        </div>
    );
}

export default function Profile() {
    const { user } = useAuth();

    const [activeSection, setActiveSection] = useState("personal");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showCompletedProfile, setShowCompletedProfile] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [profile, setProfile] = useState({
        name: "",
        phone: "",
        role: "",
        businessId: "",
        businessName: "",
        applicationStatus: "",
    });

    const [registration, setRegistration] = useState(initialRegistration);

    const activeIndex = sections.findIndex(
        (section) => section.id === activeSection
    );

    useEffect(() => {
        let mounted = true;

        async function loadProfile() {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const { data: personal, error: personalError } =
                    await supabase
                        .from("profiles")
                        .select("name, phone, role, business_id")
                        .eq("id", user.id)
                        .maybeSingle();

                if (personalError) throw personalError;

                // This lookup is optional; the profile can still load
                // if the business application is not accessible.
                const { data: application, error: applicationError } =
                    await supabase
                        .from("business_applications")
                        .select(
                            "business_name, owner_name, phone, email, status"
                        )
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: false })
                        .limit(1)
                        .maybeSingle();

                if (applicationError) {
                    console.warn(
                        "Business application lookup:",
                        applicationError.message
                    );
                }

                if (!mounted) return;

                const businessName = application?.business_name || "";

                setProfile({
                    name: personal?.name || application?.owner_name || "",
                    phone: personal?.phone || application?.phone || "",
                    role: personal?.role || "Business User",
                    businessId: personal?.business_id || "",
                    businessName,
                    applicationStatus: application?.status || "",
                });

                setRegistration((previous) => ({
                    ...previous,
                    businessName,
                }));
            } catch (err) {
                if (mounted) {
                    setError(err.message || "Unable to load your profile.");
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadProfile();

        return () => {
            mounted = false;
        };
    }, [user]);

    function updateProfile(field, value) {
        setProfile((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function updateRegistration(field, value) {
        setRegistration((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function goToSection(id) {
        setActiveSection(id);
        setError("");
        setMessage("");
    }

    function goNext() {
        if (activeIndex < sections.length - 1) {
            goToSection(sections[activeIndex + 1].id);
        }
    }

    function goBack() {
        if (activeIndex > 0) {
            goToSection(sections[activeIndex - 1].id);
        }
    }

    async function handleSave(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!user) {
            setError("Your login session was not found. Please log in again.");
            return;
        }

        if (!profile.name.trim()) {
            setError("Please enter your full name before saving.");
            goToSection("personal");
            return;
        }

        setSaving(true);

        try {
            const { data, error: saveError } = await supabase
                .from("profiles")
                .update({
                    name: profile.name.trim(),
                    phone: profile.phone.trim() || null,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id)
                .select("id");

            if (saveError) throw saveError;

            if (!data || data.length === 0) {
                throw new Error(
                    "No profile row was updated. Check that your profiles row exists and your Supabase Row Level Security policy allows updates."
                );
            }

            // Only show the completed page after Supabase confirms success.
            setShowCompletedProfile(true);
            setActiveSection("review");
        } catch (err) {
            setError(err.message || "Could not save your profile.");
        } finally {
            setSaving(false);
        }
    }

    function editProfile() {
        setShowCompletedProfile(false);
        setActiveSection("personal");
        setError("");
        setMessage("");
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center gap-3 text-gray-500">
                <LoaderCircle
                    size={24}
                    className="animate-spin text-emerald-600"
                />
                Loading your profile...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
                <AlertCircle className="mb-3" size={28} />
                <h1 className="text-xl font-bold">Login required</h1>
                <p className="mt-2 text-sm">
                    Your account could not be found. Please log in and open
                    Profile Management again.
                </p>
            </div>
        );
    }

    // Completed profile page shown after a successful save.
    if (showCompletedProfile) {
        const details = [
            { label: "Owner Name", value: profile.name, icon: UserRound },
            { label: "Login Email", value: user.email, icon: Mail },
            { label: "Contact Number", value: profile.phone, icon: Phone },
            {
                label: "Business Name",
                value: registration.businessName,
                icon: Store,
            },
            {
                label: "Business Type",
                value: registration.businessType,
                icon: Building2,
            },
            {
                label: "Registration Number",
                value: registration.registrationNumber,
                icon: ClipboardCheck,
            },
            {
                label: "Business Address",
                value: registration.address,
                icon: MapPin,
            },
            { label: "City", value: registration.city, icon: MapPin },
            { label: "State", value: registration.state, icon: MapPin },
            { label: "PIN Code", value: registration.pincode, icon: MapPin },
            {
                label: "License Number",
                value: registration.licenseNumber,
                icon: FileBadge,
            },
            { label: "GSTIN", value: registration.gstin, icon: FileBadge },
            { label: "Account Role", value: profile.role, icon: ShieldCheck },
            {
                label: "Registration Status",
                value: profile.applicationStatus,
                icon: ClipboardCheck,
            },
        ];

        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl bg-emerald-700 p-6 text-white sm:p-9">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                                <CheckCircle2 size={38} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold sm:text-3xl">
                                    Profile Saved Successfully!
                                </h1>
                                <p className="mt-2 leading-6 text-emerald-100">
                                    Your personal profile was saved. Review
                                    your account and business details below.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-bold text-emerald-800">
                                {(profile.name || user.email || "B")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                                <h2 className="break-words text-2xl font-bold text-gray-900">
                                    {profile.name || "Business Owner"}
                                </h2>
                                <p className="mt-1 break-all text-gray-500">
                                    {user.email}
                                </p>
                            </div>

                            <span className="sm:ml-auto inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
                                <CheckCircle2 size={16} />
                                Saved
                            </span>
                        </div>

                        <div className="my-7 border-t border-gray-100" />

                        <h3 className="mb-5 text-lg font-bold text-gray-900">
                            Personal & Business Details
                        </h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {details.map((item) => (
                                <DetailCard
                                    key={item.label}
                                    label={item.label}
                                    value={item.value}
                                    icon={item.icon}
                                />
                            ))}
                        </div>

                        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                            <strong>Database note:</strong> Your name and
                            phone number were saved to the existing
                            profiles table. Business registration, address,
                            license and GSTIN are displayed from this form
                            but are not yet stored in the database.
                        </div>

                        <button
                            type="button"
                            onClick={editProfile}
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                        >
                            <Pencil size={17} />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentSection = sections[activeIndex];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                <div className="mb-7">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-700">
                        <Store size={17} />
                        QUEIFY / Account Settings
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Profile Management
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                        Manage your personal information, business
                        registration and account details.
                    </p>
                </div>

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
                    {/* Sidebar */}
                    <aside className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="bg-emerald-700 p-6 text-white">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-2xl font-bold">
                                {(profile.name || user.email || "B")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <h2 className="mt-4 break-words text-lg font-bold">
                                {profile.name || "Business Owner"}
                            </h2>

                            <p className="mt-1 break-all text-sm text-emerald-100">
                                {user.email}
                            </p>

                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
                                <ShieldCheck size={15} />
                                {profile.role}
                            </div>
                        </div>

                        <nav
                            aria-label="Profile sections"
                            className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:overflow-visible"
                        >
                            {sections.map((section, index) => {
                                const Icon = section.icon;
                                const selected = activeSection === section.id;
                                const completed = index < activeIndex;

                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => goToSection(section.id)}
                                        className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition lg:w-full ${selected
                                                ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                                                : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <Icon
                                            size={19}
                                            className={
                                                selected
                                                    ? "text-emerald-700"
                                                    : "text-gray-400"
                                            }
                                        />

                                        <span>{section.label}</span>

                                        {completed && (
                                            <CheckCircle2
                                                size={16}
                                                className="ml-auto hidden text-emerald-600 lg:block"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Wizard */}
                    <main className="min-w-0">
                        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                                        Step {activeIndex + 1} of {sections.length}
                                    </p>
                                    <h2 className="mt-1 font-bold text-gray-900">
                                        {currentSection.label}
                                    </h2>
                                </div>

                                <span className="text-sm font-semibold text-gray-500">
                                    {Math.round(
                                        ((activeIndex + 1) / sections.length) *
                                        100
                                    )}
                                    %
                                </span>
                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                                    style={{
                                        width: `${((activeIndex + 1) /
                                                sections.length) *
                                            100
                                            }%`,
                                    }}
                                />
                            </div>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                            >
                                <AlertCircle
                                    size={19}
                                    className="mt-0.5 shrink-0"
                                />
                                <span>{error}</span>
                            </div>
                        )}

                        {message && (
                            <div
                                role="status"
                                className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                            >
                                <CheckCircle2 size={19} />
                                <span>{message}</span>
                            </div>
                        )}

                        <form
                            onSubmit={
                                activeSection === "review"
                                    ? handleSave
                                    : (event) => {
                                        event.preventDefault();
                                        goNext();
                                    }
                            }
                            className="rounded-2xl border border-gray-200 bg-white shadow-sm"
                        >
                            <div className="p-5 sm:p-7">
                                {activeSection === "personal" && (
                                    <>
                                        <SectionHeading
                                            title="Personal Information"
                                            description="Enter the contact details of the person managing this business account."
                                        />

                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <Field
                                                label="Full Name"
                                                value={profile.name}
                                                placeholder="Enter full name"
                                                onChange={(event) =>
                                                    updateProfile(
                                                        "name",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <div>
                                                <label className={labelClass}>
                                                    Login Email
                                                </label>
                                                <div className="relative">
                                                    <Mail
                                                        size={17}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                                    />
                                                    <input
                                                        value={user.email || ""}
                                                        readOnly
                                                        className={`${inputClass} bg-gray-100 pl-10 text-gray-500`}
                                                    />
                                                </div>
                                                <p className="mt-1.5 text-xs text-gray-500">
                                                    Managed by your login account.
                                                </p>
                                            </div>

                                            <div className="sm:col-span-2">
                                                <Field
                                                    label="Contact Number"
                                                    type="tel"
                                                    value={profile.phone}
                                                    placeholder="Enter phone number"
                                                    onChange={(event) =>
                                                        updateProfile(
                                                            "phone",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeSection === "business" && (
                                    <>
                                        <SectionHeading
                                            title="Business Registration"
                                            description="Enter your business details. You can proceed even if you need to fill in some fields later."
                                        />

                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <Field
                                                    label="Registered Business Name"
                                                    value={registration.businessName}
                                                    placeholder="Enter business name"
                                                    onChange={(event) =>
                                                        updateRegistration(
                                                            "businessName",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <SelectField
                                                label="Business Type"
                                                value={registration.businessType}
                                                options={[
                                                    "Retail Store",
                                                    "Grocery Store",
                                                    "Supermarket",
                                                    "Clothing Store",
                                                    "Electronics Store",
                                                    "Pharmacy",
                                                    "Other",
                                                ]}
                                                onChange={(event) =>
                                                    updateRegistration(
                                                        "businessType",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <Field
                                                label="Registration Number"
                                                value={registration.registrationNumber}
                                                placeholder="Enter registration number"
                                                onChange={(event) =>
                                                    updateRegistration(
                                                        "registrationNumber",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <div className="sm:col-span-2">
                                                <Field
                                                    label="Business Contact Number"
                                                    type="tel"
                                                    value={profile.phone}
                                                    placeholder="Enter contact number"
                                                    onChange={(event) =>
                                                        updateProfile(
                                                            "phone",
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeSection === "address" && (
                                    <>
                                        <SectionHeading
                                            title="Business Address"
                                            description="Enter the address associated with your business."
                                        />

                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <label className={labelClass}>
                                                    Street Address
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={registration.address}
                                                    onChange={(event) =>
                                                        updateRegistration(
                                                            "address",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Building, street, area and landmark"
                                                    className={inputClass}
                                                />
                                            </div>

                                            <Field
                                                label="City"
                                                value={registration.city}
                                                placeholder="Enter city"
                                                onChange={(event) =>
                                                    updateRegistration(
                                                        "city",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <Field
                                                label="State"
                                                value={registration.state}
                                                placeholder="Enter state"
                                                onChange={(event) =>
                                                    updateRegistration(
                                                        "state",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <Field
                                                label="PIN Code"
                                                value={registration.pincode}
                                                placeholder="Enter PIN code"
                                                onChange={(event) =>
                                                    updateRegistration(
                                                        "pincode",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                                {activeSection === "license" && (
                                    <>
                                        <SectionHeading
                                            title="License & Documents"
                                            description="Enter applicable license and tax registration details."
                                        />

                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <Field
                                                label="Business License Number"
                                                value={registration.licenseNumber}
                                                placeholder="Enter license number"
                                                onChange={(event) =>
                                                    updateRegistration(
                                                        "licenseNumber",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <Field
                                                label="GSTIN"
                                                value={registration.gstin}
                                                placeholder="Enter GSTIN if applicable"
                                                hint="Enter the GSTIN exactly as shown on your registration."
                                                onChange={(event) =>
                                                    updateRegistration(
                                                        "gstin",
                                                        event.target.value.toUpperCase()
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                                            These document details are not
                                            persisted to the database yet.
                                            They are not submitted or verified
                                            by this form.
                                        </div>
                                    </>
                                )}

                                {activeSection === "review" && (
                                    <>
                                        <SectionHeading
                                            title="Review & Account"
                                            description="Review the information you entered before saving your profile."
                                        />

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <DetailCard
                                                label="Owner Name"
                                                value={profile.name}
                                                icon={UserRound}
                                            />
                                            <DetailCard
                                                label="Login Email"
                                                value={user.email}
                                                icon={Mail}
                                            />
                                            <DetailCard
                                                label="Contact Number"
                                                value={profile.phone}
                                                icon={Phone}
                                            />
                                            <DetailCard
                                                label="Business Name"
                                                value={registration.businessName}
                                                icon={Store}
                                            />
                                            <DetailCard
                                                label="Business Type"
                                                value={registration.businessType}
                                                icon={Building2}
                                            />
                                            <DetailCard
                                                label="Registration Number"
                                                value={registration.registrationNumber}
                                                icon={ClipboardCheck}
                                            />
                                            <DetailCard
                                                label="Business Address"
                                                value={registration.address}
                                                icon={MapPin}
                                            />
                                            <DetailCard
                                                label="City"
                                                value={registration.city}
                                                icon={MapPin}
                                            />
                                            <DetailCard
                                                label="State"
                                                value={registration.state}
                                                icon={MapPin}
                                            />
                                            <DetailCard
                                                label="PIN Code"
                                                value={registration.pincode}
                                                icon={MapPin}
                                            />
                                            <DetailCard
                                                label="License Number"
                                                value={registration.licenseNumber}
                                                icon={FileBadge}
                                            />
                                            <DetailCard
                                                label="GSTIN"
                                                value={registration.gstin}
                                                icon={FileBadge}
                                            />
                                        </div>

                                        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                                            Clicking Save Personal Profile
                                            saves your name and phone to the
                                            existing profiles table. The
                                            other registration fields still
                                            need database storage configured.
                                        </div>

                                        <div className="mt-5 rounded-xl border border-gray-200 p-4">
                                            <p className="text-sm text-gray-500">
                                                Account Role
                                            </p>
                                            <p className="mt-1 font-semibold text-gray-800">
                                                {profile.role}
                                            </p>

                                            <p className="mt-4 text-sm text-gray-500">
                                                Registration Status
                                            </p>
                                            <p className="mt-1 font-semibold text-gray-800">
                                                {profile.applicationStatus ||
                                                    "Not available"}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                                <button
                                    type="button"
                                    onClick={goBack}
                                    disabled={activeIndex === 0 || saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={18} />
                                    Back
                                </button>

                                {activeSection !== "review" ? (
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                                    >
                                        Next Step
                                        <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {saving ? (
                                            <LoaderCircle
                                                size={18}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        {saving
                                            ? "Saving..."
                                            : "Save Personal Profile"}
                                    </button>
                                )}
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
}
