class Question{
  constructor(questionType){
    this.id = null;
    this.question = null;
    this.responseType = questionType;
  }
}

class VideoResponseQuestion extends Question{
  constructor(){
    super("video");
    this.preparationTime = null;
    this.responseTime = null;
  }
}

class TextResponseQuestion extends Question{
  constructor(){
    super("text");
    this.timeAllowed = 0;
    this.timeLeft = 0;
  }
}

class MultipleChoiceQuestion extends Question{
  constructor(){
    super("multiple-choice");
    this.timeAllowed = 0;
    this.timeLeft = 0;
    this.optionA = null;
    this.optionB = null;
    this.optionC = null;
    this.optionD = null;
  }
}

class AudioResponseQuestion extends Question{
  constructor(){
    super("audio");
    this.preparationTime = null;
    this.responseTime = null;
  }
}

export { VideoResponseQuestion, TextResponseQuestion, MultipleChoiceQuestion, AudioResponseQuestion }