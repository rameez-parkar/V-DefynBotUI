import { Injectable } from "@angular/core";
import { ComponentFactoryService } from "src/app/services/ComponentFactory.service";
import { DialogflowApiService } from "./dialogflowApi.service";
import { catchError, delay } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MockableApiService } from './mockableApi.service';
import { RestaurantApiService } from './restaurant-api.service';
import { LocationAccessService } from './locationAccess.service';
import { StateService } from './state.service';
import { promise } from 'protractor';
import { timeout, resolve } from 'q';


@Injectable({
  providedIn: "root"
})

export class AppService {

  constructor(
    private _componentFactoryService: ComponentFactoryService,
    private _dialogflowService: DialogflowApiService,
    private _mockableService: MockableApiService,
    private _restaurantApiService: RestaurantApiService,
    private _locationAccess:LocationAccessService,
    private _stateService:StateService
  ) {}

   async InitiateConversation(){
    await this._mockableService.GetResponse();
    this._locationAccess.getLocation().then(()=>{
        if(this._stateService.IslatLongProvided()){
        this.IntentProcessing("Hello");
      }
    });    
}

  ProcessInput(userInput: string) {
    // print on screen
    this._componentFactoryService.AddTextBubble(userInput, "user");
    // send to dialogflow and call necessary functions
    this.IntentProcessing(userInput);
  }

  IntentProcessing(userInput:string){
      this._dialogflowService.GetResponse(userInput)
      .pipe(catchError(err => {
        this._componentFactoryService.AddTextBubble("Sorry, I am unable to talk at the momment. Please contact the Site Administrator to report this issue.", "bot");
        return throwError(err);
      }))
      .subscribe(response => {

        this.IntentRouter(response["queryResult"]["intent"]["displayName"],response);
        
        // logging all responses from dialogflow for developers
        console.log("Query Text : ");
        console.log(response["queryResult"]["queryText"]);
        console.log("Result Parameters : ");
        console.log(response["queryResult"]["parameters"]);
        console.log("AllRequiredParametersPresent : ");
        console.log(response["queryResult"]["allRequiredParamsPresent"]);
        console.log("Response Text : ");
        console.log(response["queryResult"]["fulfillmentText"]);
        console.log("Intent : ");
        console.log(response["queryResult"]["intent"]["displayName"]);
        console.log("_________________________________________________________");
      });
  }

  IntentRouter(intent:string, response){
    switch(intent){
      case "Welcome" : this.WelcomeIntentIntent(response);
      break;
      case "Book Table" : this.BookTableIntent(response);
      break;
      case "Show Details" : this.ShowDetailsIntent(response);
      break;
      case "Show Carousel Again" : this.ShowCarouselAgainIntent();
      break;
      case "Proceed Table Booking" : this.ProceedTableBookingIntent(response);
      break;
      case "Fallback" : this.FallbackIntent(response);
      break;
      case "Order Food" : this.OrderFoodIntent(response);
      break;
      default: this.SmallTalkIntent(response);
      break;
    }
  }

  BookTableIntent(response){
    
    if(response["queryResult"]["allRequiredParamsPresent"])
    {
        this._componentFactoryService.StartLoader();
        let city = response["queryResult"]["parameters"]["address"];
        let guestCount =  response["queryResult"]["parameters"]["number"];
        let date =  response["queryResult"]["parameters"]["date"];
        let time =  response["queryResult"]["parameters"]["time"];

        this._stateService.setBookTableData(city,guestCount,date,time);

        this._restaurantApiService.GetRestaurantsList(city,this._stateService.getLatitude(),this._stateService.getLongitude())
        .pipe(catchError(err => {
            this._componentFactoryService.AddTextBubble("Sorry, I am unable to process this response at the moment", "bot");
            this._componentFactoryService.StopLoader();
            return throwError(err);
        }))
        .subscribe((data) => {
            if(data===404){
              this._componentFactoryService.AddTextBubble("Sorry, I wasn't able to find any restaurants in that area.", "bot");
              this._componentFactoryService.StopLoader();
            }else{
              // show results here - 
              this._restaurantApiService.SetCarouselData(data);
              this._componentFactoryService.StopLoader();
              this._componentFactoryService.AddRestaurantCarousel(data);
            }
        });    
    }else{
      this._componentFactoryService.AddTextBubble(response["queryResult"]["fulfillmentText"], "bot");
    }
  }

  ShowDetailsIntent(response){
    this._componentFactoryService.StartLoader();
      this._restaurantApiService.GetRestaurantDetails(response[0],response[1])
        .pipe(catchError(err => {
          this._componentFactoryService.StopLoader();
            this._componentFactoryService.AddTextBubble("Sorry, I am unable to fetch the selected restaurant details", "bot");
            return throwError(err);            
        }))
        .subscribe((data) => {
            if(data===404){
              this._componentFactoryService.StopLoader();
              this._componentFactoryService.AddTextBubble("Sorry, I am unable to fetch the selected restaurant details", "bot");
            }else{
              this._componentFactoryService.StopLoader();
              // show results here - 
              this._componentFactoryService.AddRestaurantDetailsCard(data);
            }
        }); 
  }

  ShowCarouselAgainIntent(){
    this._componentFactoryService.StartLoader();
    let data = this._restaurantApiService.GetCarouselData();
    this._componentFactoryService.StopLoader();
    this._componentFactoryService.AddRestaurantCarousel(data);
  }

  ProceedTableBookingIntent(response){
    if(response["queryResult"]["allRequiredParamsPresent"])
    {
        let guestCount = response["queryResult"]["parameters"]["number"];
        let date:string = response["queryResult"]["parameters"]["date"];
        date = date.split("T")[0];
        let time:string = response["queryResult"]["parameters"]["time"];
        time = time.split("T")[1].split("+")[0];
        if(guestCount>15){
          this._componentFactoryService.AddTextBubble("You can only book upto 15 guests!","bot");
          this.IntentProcessing("swimming on "+date+" at "+time);
        }else if(guestCount<1){
          this._componentFactoryService.AddTextBubble("I'd need atleast 1 guest for booking!","bot");
          this.IntentProcessing("swimming on "+date+" at "+time);
        }else{ // Proceed for booking
          this._componentFactoryService.AddTextBubble("Booking for "+guestCount+" guests on "+date+" at "+time, "bot");
        }
    }else{
    this._componentFactoryService.AddTextBubble(response["queryResult"]["fulfillmentText"], "bot");
    }
  }

  OrderFoodIntent(response) {
    if(response["queryResult"]["allRequiredParamsPresent"])
    {
        let city = response["queryResult"]["parameters"]["geo-city"]
        this._componentFactoryService.AddTextBubble(response["queryResult"]["fulfillmentText"], "bot");
    }else{
      this._componentFactoryService.AddTextBubble(response["queryResult"]["fulfillmentText"], "bot");
    }
  }

  WelcomeIntentIntent(response) {
    this._componentFactoryService.AddTextBubble(response["queryResult"]["fulfillmentText"], "bot");
    this._componentFactoryService.AddChoiceButton(["Book a Table","Order Food"]);
  }
  

  SmallTalkIntent(response){
    this._componentFactoryService.AddTextBubble(response["queryResult"]["fulfillmentText"], "bot");
  }

  FallbackIntent(response) {
    this._componentFactoryService.AddTextBubble(
      response["queryResult"]["fulfillmentText"],
      "bot"
    );
  }
}
