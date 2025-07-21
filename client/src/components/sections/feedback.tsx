import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertFeedbackSchema } from "@shared/schema";
import { Phone, Mail, Clock, Send } from "lucide-react";

const feedbackFormSchema = insertFeedbackSchema.extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

export default function Feedback() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: "",
      email: "",
      feedbackType: "",
      location: "",
      message: "",
      isAnonymous: false,
    },
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedbackData: FeedbackFormData) => {
      const submitData = form.getValues().isAnonymous 
        ? { ...feedbackData, name: "", email: "" }
        : feedbackData;
      
      await apiRequest('POST', '/api/feedback', submitData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your feedback has been submitted successfully. Thank you!",
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    setIsSubmitting(true);
    submitFeedbackMutation.mutate(data);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-dark mb-4">Feedback & Complaints</h2>
          <p className="text-lg text-gray-600">Help us improve our waste management services. Your feedback matters!</p>
        </div>

        <Card className="bg-bg-light">
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter your full name"
                    disabled={form.watch("isAnonymous")}
                    className="mt-1"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="your.email@science.pdn.ac.lk"
                    disabled={form.watch("isAnonymous")}
                    className="mt-1"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="feedbackType">Feedback Type</Label>
                <Select onValueChange={(value) => form.setValue("feedbackType", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="compliment">Compliment</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.feedbackType && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.feedbackType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  {...form.register("location")}
                  placeholder="Specify location if relevant"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  {...form.register("message")}
                  rows={5}
                  placeholder="Please provide detailed information about your feedback..."
                  className="mt-1"
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={form.watch("isAnonymous")}
                  onCheckedChange={(checked) => form.setValue("isAnonymous", checked as boolean)}
                />
                <Label htmlFor="anonymous" className="text-sm text-gray-600">
                  Submit anonymously
                </Label>
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting || !form.formState.isValid}
                  className="bg-forest text-white px-8 py-3 rounded-lg hover:bg-green-800 transition-colors font-semibold"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="bg-forest text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8" />
            </div>
            <h4 className="font-bold text-text-dark mb-2">Phone</h4>
            <p className="text-gray-600">+94 81 238 9001</p>
          </div>
          <div className="p-6">
            <div className="bg-eco text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h4 className="font-bold text-text-dark mb-2">Email</h4>
            <p className="text-gray-600">waste@science.pdn.ac.lk</p>
          </div>
          <div className="p-6">
            <div className="bg-university text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8" />
            </div>
            <h4 className="font-bold text-text-dark mb-2">Office Hours</h4>
            <p className="text-gray-600">Mon-Fri: 8:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
}
