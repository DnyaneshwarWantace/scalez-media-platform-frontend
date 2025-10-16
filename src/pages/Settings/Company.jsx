import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import { countries, currencies } from "country-data";
import {
  updateCompany,
  uploadFevicon,
  uploadLogo,
  deleteFevicon,
  deleteLogo,
} from "../../redux/slices/settingSlice";
import UpdatePasswordDialog from "./UpdatePasswordDialog";
import ImageComponent from "../../components/common/ImageComponent";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { 
  Building, 
  Edit, 
  Save, 
  X, 
  Upload, 
  Trash2,
  Globe,
  MapPin,
  Clock,
  DollarSign,
  Image as ImageIcon
} from "lucide-react";



function Company() {
  const profileData = JSON.parse(localStorage.getItem("user", ""));
  console.log('profileData :>> ', profileData);
  const [profileEditing, setprofileEditing] = useState(false);
  const [fevicon, setFevicon] = useState("");
  const [logo, setLogo] = useState("");
  const [isSwitchOn, setIsSwitchOn] = useState(false);
   const [showAlert, setShowAlert] = useState(false);
   const [showModal, setShowModal] = useState(false);

  const timezones = moment.tz.names();
  const options = timezones.map((timezone) => {
    return (
      <option value={timezone}>
        {timezone.replace("_", " ")} - {moment().tz(timezone).format("h:mm A")}
      </option>
    );
  });

  const toggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const [company, setCompany] = useState("");
  const [timezone, setTimezone] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [domain, setDomain] = useState(``);
  const currencyValue = localStorage.getItem("currency", "");

  // const [currencyVal, setcurrencyVal] = useState("");
  const dispatch = useDispatch();

  // const team = useSelector(selectAllUsers);

  // useEffect(() => {
  //   dispatch(getAllUsers());
  // }, []);

  const handleUpdateCompany = () => {
    dispatch(
      updateCompany({
        company,
        timezone,
        address,
        address2,
        city,
        state,
        country,
        zip,
        currency,
      })
    );
    setprofileEditing(false);
  };

  useEffect(() => {
    if (profileData) {
      setCompany(profileData.company);
      setTimezone(profileData.timezone);
      setAddress(profileData.address);
      setAddress2(profileData.address2);
      setZip(profileData.zip);
      setCountry(profileData.country);
      setState(profileData.state);
      // setCurrency(profileData.currency);
      setCity(profileData.city);
      
    }
  }, []);

  let currencyVal;

  const setCurrencyOnChange = (e) => {
    localStorage.setItem("currency", e.target.value);
    const newCurrency = e.target.value;
    setCurrency(newCurrency);

  }

  const countryOptions = countries.all.map((c) => {
    return <option value={c.alpha2}>{c.name}</option>;
  });

  const currencyOptions = Object.keys(currencies).map((code) => {
    return (
      <option value={code.code}>{`${code} - ${currencies[code].name}`}</option>
    );
  });

  const handleDomain = () => {
    dispatch(updateCompany({ domain }));
 
    setIsSwitchOn(!isSwitchOn);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setShowModal(true);
    }, 3000);
  };

  const handleFevicon = (file) => {
    dispatch(
      uploadFevicon({
        file: file,
      })
    );
  
  };

  const handleLogo = (file) => {
    dispatch(uploadLogo({ file: file }));
    console.log('file :>> ', file);
  };

  const handleDeleteFevicon = () => {
    dispatch(deleteFevicon());
  };
  const handleDeleteLogo = () => {
    dispatch(deleteLogo());
  };

  useEffect(() => {
    if(profileData){
    setFevicon(
    
      profileData?.fevicon
        ? `${backendServerBaseURL}/${profileData?.fevicon}`
        : "/static/icons/logo.svg"
    );
    setLogo(
     
      profileData?.logo
        ? `${backendServerBaseURL}/${profileData?.logo}`
        : "/static/icons/logo.svg"
    );
    }

    console.log('logo1 :>> ', `${backendServerBaseURL}/${profileData?.logo}`);
  }, [profileData]);

  console.log('logo2 :>> ',`${backendServerBaseURL}/${profileData?.logo}`);


 function handleModalClose() {

   setShowModal(false);
   localStorage.clear()
   window.open(`http://${profileData.domain}.scalez.in`, "_self");
 }

  return (
    <div className="p-6">
      {/* Success Alert */}
      {showAlert && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-green-800 font-medium">Subdomain updated successfully!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Company</h1>
          <p className="text-sm text-gray-500">Manage your company information and branding</p>
        </div>
      </div>

      {/* Company Branding */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Company Branding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Favicon</Label>
                <ImageComponent
                  image={fevicon}
                  handleImage={handleFevicon}
                  handleDelete={handleDeleteFevicon}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Logo (Icon + Text)</Label>
                <ImageComponent
                  image={logo}
                  handleImage={handleLogo}
                  handleDelete={handleDeleteLogo}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={!profileEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={timezone}
                onValueChange={setTimezone}
                disabled={!profileEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace("_", " ")} - {moment().tz(tz).format("h:mm A")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address">Address Line 1</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Address Line 1"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!profileEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                <Input
                  id="address2"
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  disabled={!profileEditing}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!profileEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={!profileEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={country}
                  onValueChange={setCountry}
                  disabled={!profileEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.all.map((c) => (
                      <SelectItem key={c.alpha2} value={c.alpha2}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">Zip Code</Label>
                <Input
                  id="zip"
                  type="text"
                  placeholder="Zip Code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  disabled={!profileEditing}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Currency Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select
              value={currencyValue || ""}
              onValueChange={(value) => {
                localStorage.setItem("currency", value);
                setCurrency(value);
              }}
              disabled={!profileEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(currencies).map((code) => (
                  <SelectItem key={code} value={code}>
                    {code} - {currencies[code].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        {profileEditing ? (
          <>
            <Button
              onClick={handleUpdateCompany}
              className="min-w-[10rem]"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setprofileEditing(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={() => setprofileEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
        )}
      </div>

      <UpdatePasswordDialog />

      {/* Customization Section */}
      <Card className="mb-6 opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Customization (Coming Soon!)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium mb-2">Custom Domain</h4>
                <p className="text-sm text-muted-foreground">
                  To enable mapping of a custom domain on your portal first add
                  your domain in the field & then use the values in your DNS panel
                </p>
              </div>
              <Switch
                checked={isSwitchOn}
                onCheckedChange={toggleSwitch}
                disabled={true}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <div className="flex gap-3">
                  <Input
                    className="flex-1"
                    type="text"
                    placeholder="Enter your brand name"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    disabled={!isSwitchOn}
                  />
                  <Button
                    disabled={!isSwitchOn || domain === ""}
                    onClick={handleDomain}
                  >
                    Add
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  ex. Your domain will be set to <strong>brand.scalez.in</strong>
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">DNS Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Type</Label>
                    <p className="text-sm text-muted-foreground">CNAME</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm text-muted-foreground">-</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Target</Label>
                    <p className="text-sm text-muted-foreground">scalez.in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Domain Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Domain Updated</h2>
              <p className="text-gray-600 mb-6">
                Your domain has been updated to{" "}
                <span className="text-blue-600 font-medium">
                  {profileData.domain}.scalez.in
                </span>
                . Proceed to the new domain.
              </p>
              <Button
                onClick={handleModalClose}
                className="w-full"
              >
                Proceed to New Domain
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Company;
