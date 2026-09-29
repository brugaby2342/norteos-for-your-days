import { useEffect, useRef, useState } from "react";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import { NoteCard } from "@/components/note-card";
import { ProjectModules } from "@/components/project-modules";
import { packetProgress, asLayers, slugTag, type DistillLayers, type Packet, type ProjectStatus } from "@/lib/types";
import { usePos } from "@/lib/store";
