package com.controlidade.platform.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * User: bbonfim
 * Date: 4/15/17
 * Time: 8:56 PM
 */
public class CustomerDateAndTimeDeserialize extends JsonDeserializer<Date> {

  private SimpleDateFormat dateFormat = new SimpleDateFormat(
          "yyyy-MM-dd HH:mm:ss");

  @Override
  public Date deserialize(JsonParser paramJsonParser,
                          DeserializationContext paramDeserializationContext)
          throws IOException, JsonProcessingException {
    String str = paramJsonParser.getText().trim();
    try {
      return dateFormat.parse(str);
    } catch (ParseException e) {

    }
    return paramDeserializationContext.parseDate(str);
  }
}