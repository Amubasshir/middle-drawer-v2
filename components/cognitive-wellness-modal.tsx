"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";
import { saveWellnessCheck } from "@/lib/actions/wellness-actions";
import { getDelegateContactsByDelegate, getDelegatesByUser, withBrowserClient } from "@/lib/db";
import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";

interface CognitiveWellnessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_WORDS = [
  ["apple", "chair", "ocean", "guitar"],
  ["mountain", "coffee", "bicycle", "sunset"],
  ["library", "garden", "piano", "rainbow"],
  ["forest", "candle", "telescope", "butterfly"],
];

const DISTRACTOR_WORDS = [
  "elephant",
  "keyboard",
  "thunder",
  "crystal",
  "volcano",
  "whisper",
  "diamond",
  "shadow",
];

interface DelegateUI {
  id: string;
  name: string;
  relationship: string;
  permissions: string[];
  notes: string;
  emails: { id?: string; address: string; verified: boolean }[];
  phones: { id?: string; number: string; verified: boolean }[];
}


export default function CognitiveWellnessModal({
  isOpen,
  onClose,
}: CognitiveWellnessModalProps) {
    const [stage, setStage] = useState<
    "instructions" | "showing" | "countdown" | "testing" | "result"
    >("instructions");
  const supabase = createClient();
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [testWords, setTestWords] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [startTime, setStartTime] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [failureCount, setFailureCount] = useState(0);
  const [lastFailureTime, setLastFailureTime] = useState<number | null>(null);
  const { user } = useAuth();
    const [delegates, setDelegates] = useState<DelegateUI[]>([]);



    
  // Load delegates from database
  const loadDelegates = useCallback(async () => {
    if (!user || user.id === "guest") {
    //   setIsLoading(false);
      return;
    }

    try {
    //   setIsLoading(true);
      const result = await withBrowserClient(async (client) => {
        const delegatesResult = await getDelegatesByUser(client, user.id);
        if (delegatesResult.error || !delegatesResult.data) {
          console.error("Error loading delegates:", delegatesResult.error);
          return [];
        }

        // Load contacts for each delegate
        const delegatesWithContacts = await Promise.all(
          delegatesResult.data.map(async (delegate) => {
            const contactsResult = await getDelegateContactsByDelegate(
              client,
              delegate.id
            );
            const contacts = contactsResult.data || [];

            const emailContacts = contacts
            .filter(contact => contact.contact_type === "email")
            .map(contact => ({
                address: contact.contact_value,
                verified: contact.is_verified
            }));
            // return transformDelegateToUI(delegate, contacts);
            return emailContacts;
        })
    );
    
    return delegatesWithContacts;
});

// console.log({result})
      setDelegates(result[0]);
    } catch (error) {
      console.error("Error loading delegates:", error);
    } finally {
    //   setIsLoading(false);
    }
  }, [user]);

  // Load delegates on mount and when user changes
  useEffect(() => {
    loadDelegates();
  }, [loadDelegates]);




  const startTest = () => {
    const wordSet =
      SAMPLE_WORDS[Math.floor(Math.random() * SAMPLE_WORDS.length)];
    setCurrentWords(wordSet);
    setStage("showing");
    setTimeLeft(10);
  };

//   const handleAnswer = async (selectedWord: string) => {
//     const endTime = Date.now();
//     const timeTaken = endTime - startTime;
//     const correct = selectedWord === correctAnswer;

//     setIsCorrect(correct);
//     setResponseTime(timeTaken);
//     setStage("result");

//     try {
//       const result = await saveWellnessCheck({
//         question: `Which word wasn't in the original list? Words shown: ${currentWords.join(
//           ", "
//         )}`,
//         answer: `Selected: ${selectedWord}, Correct: ${correctAnswer}`,
//         score: correct ? 1 : 0,
//       });

//       if (!result.success) {
//         console.error("Error saving wellness check:", result.error);
//       }
//     } catch (error) {
//       console.error("Error saving wellness check:", error);
//     }
//   };


const handleAnswer = async (selectedWord: string) => {
  const endTime = Date.now()
  const timeTaken = endTime - startTime
  const correct = selectedWord === correctAnswer

  setIsCorrect(correct)
  setResponseTime(timeTaken)
  setStage("result")

  // Handle consecutive failures
  if (!correct) {
    const currentTime = Date.now()
    
    // Check if this is a consecutive failure within 30 minutes
    if (lastFailureTime && (currentTime - lastFailureTime) < 30 * 60 * 1000) {
      const newFailureCount = failureCount + 1
      setFailureCount(newFailureCount)
      
      // If this is the second consecutive failure
      if (newFailureCount >= 2) {
        try {
          // Call Supabase Edge Function to notify delegates
          const { error: fnError } = await supabase.functions.invoke('notify-delegates', {
            body: { 
              userDetails: {
                testTime: new Date().toISOString(),
                words: currentWords,
                selectedAnswer: selectedWord,
                correctAnswer: correctAnswer,
                responseTime: timeTaken,
              },
              delegates: {
                    emails: delegates,
              },
              userId: '6fedd312-d6dc-4482-ad12-731bfa42d4ec'
            }
          })

          if (fnError) {
            console.error('Failed to notify delegates:', fnError)
          }

          localStorage.setItem('isSubmitTwice', JSON.stringify(false))
        } catch (error) {
          console.error('Error calling notify function:', error)
        }
      }
    } else {
      // Reset failure count if more than 30 minutes have passed
      setFailureCount(1)
    }
    setLastFailureTime(currentTime)
  } else {
    // Reset failure tracking on success
    setFailureCount(0)
    setLastFailureTime(null)
  }

  try {
    const result = await saveWellnessCheck({
      question: `Which word wasn't in the original list? Words shown: ${currentWords.join(", ")}`,
      answer: `Selected: ${selectedWord}, Correct: ${correctAnswer}`,
      score: correct ? 1 : 0,
    })

    if (!result.success) {
      console.error("Error saving wellness check:", result.error)
    }
  } catch (error) {
    console.error("Error saving wellness check:", error)
  }
}


  const resetTest = () => {
    setStage("instructions");
    setIsCorrect(null);
    setResponseTime(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (stage === "showing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (stage === "showing" && timeLeft === 0) {
      setStage("countdown");
      setTimeLeft(5);
    } else if (stage === "countdown" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (stage === "countdown" && timeLeft === 0) {
      // Create test words: 3 from original + 1 distractor
      const shuffledOriginal = [...currentWords]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const distractor =
        DISTRACTOR_WORDS[Math.floor(Math.random() * DISTRACTOR_WORDS.length)];
      const allTestWords = [...shuffledOriginal, distractor].sort(
        () => Math.random() - 0.5
      );

      setTestWords(allTestWords);
      setCorrectAnswer(distractor);
      setStage("testing");
      setTimeLeft(7);
      setStartTime(Date.now());
    } else if (stage === "testing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (stage === "testing" && timeLeft === 0) {
      // Time's up - record as incorrect
      handleAnswer("");
    }

    return () => clearInterval(interval);
  }, [stage, timeLeft, currentWords]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cognitive Wellness Quick Check</DialogTitle>
        </DialogHeader>

        {stage === "instructions" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is a simple memory test. You'll see 4 words for 10 seconds,
              then identify which word wasn't in the original list.
            </p>
            <div className="flex gap-2">
              <Button onClick={startTest} className="flex-1">
                Start Test
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {stage === "showing" && (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              These words will disappear in {timeLeft} seconds
            </p>
            <div className="grid grid-cols-2 gap-4 p-6 bg-muted rounded-lg">
              {currentWords.map((word, index) => (
                <div
                  key={index}
                  className="text-lg font-medium p-3 bg-background rounded border"
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="text-2xl font-bold text-primary">{timeLeft}</div>
          </div>
        )}

        {stage === "countdown" && (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Get ready...</p>
            <div className="text-6xl font-bold text-primary">{timeLeft}</div>
          </div>
        )}

        {stage === "testing" && (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Which word wasn't on the previous list?
            </p>
            <div className="text-lg font-bold text-primary">
              Time left: {timeLeft}s
            </div>
            <div className="grid grid-cols-2 gap-3">
              {testWords.map((word, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleAnswer(word)}
                  className="p-4 text-base"
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>
        )}

        {stage === "result" && (
          <div className="space-y-4 text-center">
            <div
              className={`text-lg font-bold ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </div>
            <p className="text-sm text-muted-foreground">
              Response time: {(responseTime / 1000).toFixed(1)} seconds
            </p>
            {!isCorrect && (
              <p className="text-sm text-muted-foreground">
                The correct answer was: <strong>{correctAnswer}</strong>
              </p>
            )}
            <div className="flex gap-2">
              <Button onClick={resetTest} className="flex-1">
                Do it again?
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
