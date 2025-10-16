import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProfilePicture, updateProfile, updateProfilePicture, selectAllUsers, getAllUsers } from "../../redux/slices/settingSlice";
import { getMe, selectMe } from "../../redux/slices/generalSlice";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import UpdatePasswordDialog from "./UpdatePasswordDialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Edit, Trash2, Save, X, Key } from "lucide-react";


function Profile() {
  const [profileEditing, setprofileEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const roleRef = useRef();
  const aboutMeRef = useRef();
  const profilePictureFileRef = useRef();
  const dispatch = useDispatch();
  const team = useSelector(selectAllUsers);
  const user = useSelector(selectMe);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getMe());
  }, []);

  const handleSaveProfile = () => {
    dispatch(
      updateProfile({
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        email: emailRef.current.value,
        designation: roleRef.current.value,
        about: aboutMeRef.current.value,
      })
    );
    setprofileEditing(false);
  };

  const handleCancelEdit = () => {
    setprofileEditing(false);
  };

  const handleEditProfile = () => {
    setprofileEditing(true);
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files.length !== 0) {
      dispatch(
        updateProfilePicture({
          file: e.target.files[0],
        })
      );
    }
  };

  const handleDeleteProfilePicture = () => {
    dispatch(deleteProfilePicture());
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Profile</h1>
          <p className="text-sm text-gray-500">Manage your personal profile</p>
        </div>
      </div>

        {/* Hidden file input */}
        <input
          className="hidden"
          type="file"
          ref={profilePictureFileRef}
          onChange={handleProfilePictureChange}
          accept="image/*"
        />

        <div className="w-full">
          {/* Profile Picture Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={`${backendServerBaseURL}/${user?.avatar}`} 
                    alt={`${user?.firstName} ${user?.lastName}`}
                  />
                  <AvatarFallback>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => profilePictureFileRef.current.click()}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteProfilePicture}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    ref={firstNameRef}
                    type="text"
                    placeholder="Enter First Name"
                    defaultValue={user?.firstName}
                    disabled={!profileEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    ref={lastNameRef}
                    type="text"
                    placeholder="Enter Last Name"
                    defaultValue={user?.lastName}
                    disabled={!profileEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  ref={emailRef}
                  type="email"
                  placeholder="Enter Email"
                  defaultValue={user?.email}
                  disabled={!profileEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  ref={roleRef}
                  type="text"
                  placeholder="Enter Role"
                  defaultValue={user?.role?.name}
                  disabled={true}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About Me</Label>
                <Textarea
                  id="about"
                  ref={aboutMeRef}
                  placeholder="Tell us about yourself..."
                  defaultValue={user?.about}
                  disabled={!profileEditing}
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {profileEditing ? (
                  <>
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleEditProfile}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPasswordDialog(true)}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      <UpdatePasswordDialog 
        open={showPasswordDialog} 
        onOpenChange={setShowPasswordDialog} 
      />
    </div>
  );
}

export default Profile;
