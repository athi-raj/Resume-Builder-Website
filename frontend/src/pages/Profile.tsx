import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useAuthStore from '@/hooks/useAuthStore';
import { toast } from '@/components/ui/use-toast';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, CameraIcon, Trash2Icon } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    profileImage: user?.profileImage || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile(formData);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImageLoading(true);
    
    try {
      // Check file size
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Image too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        setIsImageLoading(false);
        return;
      }

      // In a real app, you would upload to a server or cloud storage
      // For now, we'll use a local data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result as string
        }));
        setIsImageLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setIsImageLoading(false);
    }
  };

  const removeProfileImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: ''
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8f2ff] via-[#eef6ff] to-[#f0f7ff]">
      <Navbar />
      
      <motion.main 
        className="flex-1 pt-24 pb-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-2xl mx-auto px-6">
          <motion.div className="mb-8" variants={itemVariants}>
            <h1 className="text-3xl font-display font-bold text-[#2d2b4e]">Profile Settings</h1>
            <p className="text-[#4a4869] mt-1">
              Update your personal information
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border border-[#e8f3ff] overflow-hidden">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Image Section */}
                  <motion.div className="flex flex-col items-center mb-6" variants={itemVariants}>
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-[#e8f3ff]">
                      {formData.profileImage ? (
                        <div className="relative w-full h-full group">
                          <img 
                            src={formData.profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white hover:bg-white/20"
                              onClick={removeProfileImage}
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-[#e8f3ff] flex items-center justify-center">
                          <UserIcon className="h-12 w-12 text-[#4a4869]" />
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isImageLoading}
                      className="border-[#e8f3ff] text-[#4a4869] hover:bg-[#f8f2ff]"
                    >
                      {isImageLoading ? (
                        "Uploading..."
                      ) : (
                        <>
                          <CameraIcon className="mr-2 h-4 w-4" />
                          {formData.profileImage ? "Change Photo" : "Upload Photo"}
                        </>
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </motion.div>

                  <div className="space-y-4">
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4a4869]" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pl-10 border-[#e8f3ff] focus:border-[#6366f1] focus:ring-[#6366f1]/10 text-[#2d2b4e] placeholder:text-[#4a4869]/50"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4a4869]" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10 border-[#e8f3ff] focus:border-[#6366f1] focus:ring-[#6366f1]/10 text-[#2d2b4e] placeholder:text-[#4a4869]/50"
                          placeholder="Your email address"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4a4869]" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10 border-[#e8f3ff] focus:border-[#6366f1] focus:ring-[#6366f1]/10 text-[#2d2b4e] placeholder:text-[#4a4869]/50"
                          placeholder="Your phone number"
                        />
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4a4869]" />
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="pl-10 border-[#e8f3ff] focus:border-[#6366f1] focus:ring-[#6366f1]/10 text-[#2d2b4e] placeholder:text-[#4a4869]/50"
                          placeholder="Your location (city, country)"
                        />
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="border-[#e8f3ff] focus:border-[#6366f1] focus:ring-[#6366f1]/10 text-[#2d2b4e] placeholder:text-[#4a4869]/50 min-h-[120px]"
                        placeholder="Tell us about yourself..."
                      />
                    </motion.div>
                  </div>

                  <motion.div className="flex justify-end gap-4" variants={itemVariants}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                      className="border-[#e8f3ff] text-[#4a4869] hover:bg-[#f8f2ff]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Profile; 