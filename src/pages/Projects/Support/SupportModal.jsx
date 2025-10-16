import { Form, FormikProvider, useFormik } from "formik";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { createFeedback } from "../../../redux/slices/projectSlice";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Play, Star, Clock, X, SkipForward } from "lucide-react";

function SupportModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [selectedMenu, setselectedMenu] = useState("Tutorials");
  const [videoRef, setVideoRef] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  
  const closeDialog = () => {
    onClose();
  };

  // Timeline data with timestamps in seconds
  const timelineSteps = [
    { title: "Dashboard", time: "00:29", seconds: 29 },
    { title: "Process", time: "00:40", seconds: 40 },
    { title: "Projects", time: "1:05", seconds: 65 },
    { title: "Goals", time: "1:41", seconds: 101 },
    { title: "Ideas", time: "3:54", seconds: 234 },
    { title: "Tests", time: "6:13", seconds: 373 },
    { title: "Learning", time: "6:58", seconds: 418 },
    { title: "Insights", time: "7:14", seconds: 434 }
  ];

  const jumpToTimestamp = (seconds) => {
    if (videoRef) {
      videoRef.currentTime = seconds;
      setActiveStep(seconds);
    }
  };

  const NewProjectSchema = Yup.object().shape({
    category: Yup.string().required("Category is required"),
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      category: "",
      title: "",
      description: "",
    },
    validateOnBlur: true,
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      console.log(values);
      setSubmitting(true);
      await dispatch(createFeedback({ ...values, closeModal: closeDialog }));
      setSubmitting(false);
    },
  });

  const TutorialStep = ({ title, time, seconds, isActive = false, onClick }) => {
    return (
      <Card 
        className={`mb-3 transition-all cursor-pointer ${isActive ? 'bg-primary/10 border-primary shadow-md' : 'hover:bg-muted/50 hover:shadow-sm'}`}
        onClick={() => onClick(seconds)}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <SkipForward className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium text-sm">{title}</span>
            </div>
            <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {time}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values, resetForm } = formik;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Help & Support
          </DialogTitle>
          <DialogDescription>
            Learn how to use the platform or send us your feedback
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Tabs value={selectedMenu} onValueChange={setselectedMenu} className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
                  <TabsTrigger value="Tutorials">Tutorials</TabsTrigger>
                  <TabsTrigger value="Feedback">Feedback</TabsTrigger>
                </TabsList>

                <TabsContent value="Tutorials" className="flex-1 overflow-auto mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    {/* Video Section */}
                    <div className="lg:col-span-2">
                      <div className="bg-muted rounded-lg p-4 sticky top-0">
                        <video
                          ref={setVideoRef}
                          controls
                          src="/static/images/Scalez_Platform-Introduction.mp4"
                          className="w-full rounded-lg"
                          style={{ maxHeight: "400px" }}
                          onTimeUpdate={(e) => {
                            const currentTime = e.target.currentTime;
                            // Find the closest step based on current time
                            const closestStep = timelineSteps.reduce((prev, curr) => 
                              Math.abs(curr.seconds - currentTime) < Math.abs(prev.seconds - currentTime) ? curr : prev
                            );
                            if (Math.abs(closestStep.seconds - currentTime) < 5) {
                              setActiveStep(closestStep.seconds);
                            }
                          }}
                        >
                          Sorry, your browser doesn't support embedded videos, but don't worry, you can
                          <a href="https://archive.org/details/BigBuckBunny_124">download it</a>
                          and watch it with your favorite video player!
                        </video>
                      </div>
                    </div>

                    {/* Tutorial Steps */}
                    <div className="space-y-2 overflow-y-auto max-h-[500px]">
                      <div className="flex items-center gap-2 mb-4 sticky top-0 bg-background pb-2">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          8 Timestamps (8 mins)
                        </Badge>
                      </div>

                      {timelineSteps.map((step) => (
                        <TutorialStep 
                          key={step.seconds}
                          title={step.title} 
                          time={step.time}
                          seconds={step.seconds}
                          isActive={activeStep === step.seconds}
                          onClick={jumpToTimestamp}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="Feedback" className="flex-1 overflow-auto mt-6">
                  <div className="space-y-6 pb-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select {...getFieldProps("category")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Issue">Issue</SelectItem>
                          <SelectItem value="Suggestion">Suggestion</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {touched.category && errors.category && (
                        <p className="text-sm text-red-500">{errors.category}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        type="text"
                        {...getFieldProps("title")}
                        placeholder="Feedback Title"
                        className={touched.title && errors.title ? "border-red-500" : ""}
                      />
                      {touched.title && errors.title && (
                        <p className="text-sm text-red-500">{errors.title}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={5}
                        {...getFieldProps("description")}
                        placeholder="Feedback Description"
                        className={touched.description && errors.description ? "border-red-500" : ""}
                      />
                      {touched.description && errors.description && (
                        <p className="text-sm text-red-500">{errors.description}</p>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 sticky bottom-0 bg-background pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Form>
          </FormikProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SupportModal;
