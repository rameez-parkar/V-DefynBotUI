import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChatbotComponent } from "./components/chatbot/chatbot.component";
import { ChatBodyComponent } from "./components/chatbot/chat-body/chat-body.component";
import { ChatInputComponent } from "./components/chatbot/chat-input/chat-input.component";
import { LauncherComponent } from "./components/launcher/launcher.component";
import { FormComponent } from "./components/launcher/form/form.component";
import { TextBubbleComponent } from "./components/chatbot/chat-body/text-bubble/text-bubble.component";
import { HttpClientModule } from "@angular/common/http";
import { ChoiceButtonComponent } from "./components/chatbot/chat-body/choice-button/choice-button.component";
import { HeaderModule } from "./modules/header/header.module";

@NgModule({
  declarations: [
    AppComponent,
    ChatbotComponent,
    ChatBodyComponent,
    ChatInputComponent,
    LauncherComponent,
    FormComponent,
    TextBubbleComponent,
    ChoiceButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HeaderModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [TextBubbleComponent, ChoiceButtonComponent]
})
export class AppModule {}
